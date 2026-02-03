#!/usr/bin/env python3
"""
Downsample existing .splat files (no PLY needed).
Keeps the most important points (by scale * opacity) so files load faster.
Usage:
  python tools/downsample_splat.py --ratio 0.25 public/splat/*.splat
  python tools/downsample_splat.py --ratio 0.5 public/splat/monitor-barn.splat -o public/splat/monitor-barn.splat
"""

import argparse
import numpy as np
import os
import sys

ROW_BYTES = 32  # 3*4 pos + 3*4 scale + 4 rgba + 4 quat


def downsample_splat(path: str, ratio: float = 1.0, max_points: int | None = None, out_path: str | None = None) -> None:
    data = np.fromfile(path, dtype=np.uint8)
    n = len(data) // ROW_BYTES
    if n * ROW_BYTES != len(data):
        raise ValueError(f"File size not a multiple of {ROW_BYTES}: {path}")

    # View as structured: 12 pos (float32), 12 scale (float32), 4 rgba, 4 quat
    raw = data.reshape(n, ROW_BYTES)
    pos_scale = raw[:, :24].view(np.float32).reshape(n, 6)  # x,y,z, scale_x, scale_y, scale_z
    rgba = raw[:, 24:28]
    opacity = rgba[:, 3] / 255.0
    scale_prod = pos_scale[:, 3] * pos_scale[:, 4] * pos_scale[:, 5]  # already exp'd in .splat
    importance = scale_prod * opacity
    order = np.argsort(-importance)

    keep = int(n * ratio) if max_points is None else min(n, max_points)
    order = order[:keep]

    out = raw[order].tobytes()
    out_file = out_path or path
    with open(out_file, "wb") as f:
        f.write(out)
    print(f"  {path}: {n} -> {keep} points ({100*keep/n:.1f}%), {len(out)/(1024*1024):.2f} MB -> {out_file}")


def main():
    parser = argparse.ArgumentParser(description="Downsample .splat files by keeping most important points.")
    parser.add_argument("inputs", nargs="+", help=".splat files to downsample (in-place or -o).")
    parser.add_argument("--ratio", "-r", type=float, default=0.25, help="Fraction of points to keep (default 0.25 = 4x smaller).")
    parser.add_argument("--max-points", "-n", type=int, default=None, help="Max points to keep (overrides --ratio).")
    parser.add_argument("--output", "-o", default=None, help="Output path (only for single input). Otherwise overwrites in place.")
    args = parser.parse_args()

    if args.output and len(args.inputs) > 1:
        print("error: --output only valid with a single input file", file=sys.stderr)
        sys.exit(1)

    for path in args.inputs:
        if not path.endswith(".splat"):
            print(f"  skip (not .splat): {path}")
            continue
        out = args.output if len(args.inputs) == 1 else None
        downsample_splat(path, ratio=args.ratio, max_points=args.max_points, out_path=out)


if __name__ == "__main__":
    main()
