# You can use this to convert a .ply file to a .splat file programmatically in python
# Alternatively you can drag and drop a .ply file into the viewer at https://antimatter15.com/splat

from plyfile import PlyData
import numpy as np
import argparse
from io import BytesIO


def process_ply_to_splat(ply_file_path, ratio=1.0, max_points=None):
    """Convert PLY to .splat. Points are sorted by importance (scale * opacity).
    Use ratio < 1 or max_points to keep only the most important points for smaller files."""
    plydata = PlyData.read(ply_file_path)
    vert = plydata["vertex"]
    n = len(vert["x"])
    sorted_indices = np.argsort(
        -np.exp(vert["scale_0"] + vert["scale_1"] + vert["scale_2"])
        / (1 + np.exp(-vert["opacity"]))
    )
    if ratio < 1.0 or max_points is not None:
        keep = int(n * ratio) if max_points is None else min(n, max_points)
        sorted_indices = sorted_indices[:keep]
        print(f"  Downsampled: {n} -> {len(sorted_indices)} points ({100*len(sorted_indices)/n:.1f}%)")
    buffer = BytesIO()
    for idx in sorted_indices:
        v = plydata["vertex"][idx]
        position = np.array([v["x"], v["y"], v["z"]], dtype=np.float32)
        scales = np.exp(
            np.array(
                [v["scale_0"], v["scale_1"], v["scale_2"]],
                dtype=np.float32,
            )
        )
        rot = np.array(
            [v["rot_0"], v["rot_1"], v["rot_2"], v["rot_3"]],
            dtype=np.float32,
        )
        SH_C0 = 0.28209479177387814
        color = np.array(
            [
                0.5 + SH_C0 * v["f_dc_0"],
                0.5 + SH_C0 * v["f_dc_1"],
                0.5 + SH_C0 * v["f_dc_2"],
                1 / (1 + np.exp(-v["opacity"])),
            ]
        )
        buffer.write(position.tobytes())
        buffer.write(scales.tobytes())
        buffer.write((color * 255).clip(0, 255).astype(np.uint8).tobytes())
        buffer.write(
            ((rot / np.linalg.norm(rot)) * 128 + 128)
            .clip(0, 255)
            .astype(np.uint8)
            .tobytes()
        )

    return buffer.getvalue()


def save_splat_file(splat_data, output_path):
    with open(output_path, "wb") as f:
        f.write(splat_data)


def main():
    parser = argparse.ArgumentParser(description="Convert PLY files to SPLAT format.")
    parser.add_argument(
        "input_files", nargs="+", help="The input PLY files to process."
    )
    parser.add_argument(
        "--output", "-o", default="output.splat", help="The output SPLAT file."
    )
    parser.add_argument(
        "--ratio", "-r", type=float, default=1.0,
        help="Keep this fraction of points (by importance), e.g. 0.25 for 25%% (~4x smaller). Default 1.0."
    )
    parser.add_argument(
        "--max-points", "-n", type=int, default=None,
        help="Keep at most this many points (by importance). Overrides --ratio if set."
    )
    args = parser.parse_args()
    for input_file in args.input_files:
        print(f"Processing {input_file}...")
        splat_data = process_ply_to_splat(input_file, ratio=args.ratio, max_points=args.max_points)
        output_file = (
            args.output if len(args.input_files) == 1 else input_file.replace(".ply", "") + ".splat"
        )
        if args.output != "output.splat" and len(args.input_files) == 1:
            output_file = args.output
        save_splat_file(splat_data, output_file)
        print(f"Saved {output_file} ({len(splat_data) / (1024*1024):.2f} MB)")


if __name__ == "__main__":
    main()
