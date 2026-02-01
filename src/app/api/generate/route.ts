import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import projectsData from '@/data/projects.json';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    const project = projectsData.find((p) => p.slug === slug);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.fallbackMediaUrl) {
      return NextResponse.json({ error: 'No input image (fallbackMediaUrl) found' }, { status: 400 });
    }

    const rootDir = process.cwd();
    const inputImage = path.join(rootDir, 'public', project.fallbackMediaUrl);
    const outputDir = path.join(rootDir, 'public', 'splat', slug); // Temp output folder
    const finalSplatPath = path.join(rootDir, 'public', 'splat', `${slug}.splat`);
    const mlSharpPath = path.join(rootDir, 'tools', 'ml-sharp');
    const converterPath = path.join(rootDir, 'tools', 'convert_ply_to_splat.py');

    // 1. Ensure input exists
    try {
      await fs.access(inputImage);
    } catch {
      return NextResponse.json({ error: `Input image not found at ${inputImage}` }, { status: 404 });
    }

    // 2. Run SHARP Prediction
    console.log(`Starting SHARP prediction for ${slug}...`);
    
    // We need to add 'src' to PYTHONPATH so python can find the 'sharp' module
    // And run the cli entry point explicitly
    const sharpCmd = `python3 -c "from sharp.cli import main_cli; main_cli()" predict -i "${inputImage}" -o "${outputDir}"`;
    
    await execAsync(sharpCmd, { 
      cwd: mlSharpPath,
      env: { 
        ...process.env,
        PYTHONPATH: path.join(mlSharpPath, 'src') 
      }
    });

    // 3. Find the generated .ply file
    // SHARP output structure might be outputDir/point_cloud/iteration_30000/point_cloud.ply or similar
    // Or just directly in the folder depending on version.
    // The README says: "The results will be 3D gaussian splats (3DGS) in the output folder."
    // Let's assume it puts .ply files there. I'll search for it.
    
    // Recursive search for .ply
    const findPly = async (dir: string): Promise<string | null> => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const res = await findPly(fullPath);
          if (res) return res;
        } else if (entry.name.endsWith('.ply')) {
          return fullPath;
        }
      }
      return null;
    };

    const plyFile = await findPly(outputDir);
    if (!plyFile) {
       throw new Error("SHARP finished but no .ply file was found in output.");
    }

    // 4. Convert to .splat
    console.log(`Converting ${plyFile} to .splat...`);
    const convertCmd = `python3 "${converterPath}" "${plyFile}" -o "${finalSplatPath}"`;
    await execAsync(convertCmd);

    // 5. Cleanup Temp Dir (Optional, maybe keep for debugging)
    // await fs.rm(outputDir, { recursive: true, force: true });

    // 6. Update projects.json
    // We need to write back to the file
    const projectsPath = path.join(rootDir, 'src', 'data', 'projects.json');
    const newProjects = projectsData.map(p => {
      if (p.slug === slug) {
        return { ...p, splatUrl: `/splat/${slug}.splat` };
      }
      return p;
    });

    await fs.writeFile(projectsPath, JSON.stringify(newProjects, null, 2));

    return NextResponse.json({ success: true, splatUrl: `/splat/${slug}.splat` });

  } catch (error: any) {
    console.error("Generation failed:", error);
    return NextResponse.json({ 
      error: error.message || 'Generation failed', 
      details: error.stderr || '' 
    }, { status: 500 });
  }
}
