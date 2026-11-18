#!/usr/bin/env python3
"""Build Reply News: one self-contained index.html from src/, lib/ and assets/.

    python build.py

The page holds the engine, the wallpapers and the Jupiter music. Neptune and
Stars and Stripes load from assets/ when they are chosen. version.json names
this build, so a page the browser kept from before loads the new one.
"""
import base64
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def b64(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode("ascii")


def main() -> None:
    ui_ja = (ROOT / "src" / "ui_ja.js").read_text(encoding="utf-8")
    engine = (ROOT / "src" / "engine.js").read_text(encoding="utf-8")
    muxer = (ROOT / "lib" / "mp4-muxer.js").read_text(encoding="utf-8")
    for name, code in (("mp4-muxer.js", muxer), ("engine.js", engine), ("ui_ja.js", ui_ja)):
        if "</script" in code.lower():
            raise SystemExit(f"{name} contains </script")
    assets = {"bg_" + g: b64(ROOT / "assets" / f"bg_{g}.jpg") for g in "ABCDE"}
    assets["track"] = b64(ROOT / "assets" / "jupiter_1922.m4a")
    license_note = "/* mp4-muxer 5.2.2 (MIT License, Copyright (c) 2023 Vanilagy) — lib/mp4-muxer.LICENSE */\n"
    html = (
        (ROOT / "src" / "reply.html").read_text(encoding="utf-8")
        .replace("/*__UIJA__*/", ui_ja)
        .replace("/*__MUXER__*/", license_note + muxer)
        .replace("/*__ENGINE__*/", engine)
        .replace("/*__ASSETS__*/", json.dumps(assets))
        .replace("/*__SAMPLE__*/", "")
    )
    build_id = hashlib.sha1(html.encode("utf-8")).hexdigest()[:12]
    html = html.replace("__BUILD_ID__", build_id)
    (ROOT / "index.html").write_text(html, encoding="utf-8")
    (ROOT / "version.json").write_text(json.dumps({"reply": build_id}) + "\n", encoding="utf-8")
    print(f"index.html {len(html.encode('utf-8')) / 1048576:.2f} MB")


if __name__ == "__main__":
    main()
