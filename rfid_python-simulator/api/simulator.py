#!/usr/bin/env python3

"""
RFID Simulator Service
----------------------

FastAPI + Uvicorn RFID Simulator.

This service simulates RFID tag scans and forwards them
to the Node.js backend.

Run FastAPI server:

    uvicorn simulator:app --reload --host 0.0.0.0 --port 8000

Or:

    python simulator.py

API:
    GET  /
    GET  /health
    POST /scan
    POST /scan/random
    POST /scan/unknown
"""

import os
import requests
import random
import time
import argparse

from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


# ============================================================
# Configuration
# ============================================================



API_BASE = os.getenv(
    "BACKEND_URL",
    "https://rfidbackend-one.vercel.app/api"
)
SCAN_ENDPOINT = f"{API_BASE}/rfid/scan"

DEFAULT_READER_ID = "PYTHON-SIM"


# ============================================================
# FastAPI App
# ============================================================

app = FastAPI(
    title="RFID Simulator API",
    description="Python RFID Simulator Service",
    version="1.0.0",
)


# ============================================================
# Sample UIDs
# ============================================================

KNOWN_UIDS = [
    "A1B2C3D4",
    "E5F6A7B8",
    "C9D0E1F2",
    "12345678",
    "87654321",
    "AABBCCDD",
    "11223344",
    "55667788",
]

UNKNOWN_UIDS = [
    "DEADBEEF",
    "CAFEBABE",
    "FACEFEED",
    "BADDCAFE",
]

ACTIONS = [
    "inventory",
    "check-in",
    "check-out",
    "locate",
]


# ============================================================
# Pydantic Models
# ============================================================

class ScanRequest(BaseModel):
    uid: str
    action: str = "inventory"
    readerId: str = DEFAULT_READER_ID
    notes: Optional[str] = None


class RandomScanRequest(BaseModel):
    action: str = "inventory"
    readerId: str = DEFAULT_READER_ID


# ============================================================
# Generate Random UID
# ============================================================

def generate_random_uid():
    """
    Generate a random 8-character hexadecimal UID.
    """

    return "".join(
        random.choices(
            "0123456789ABCDEF",
            k=8
        )
    )


# ============================================================
# Send Scan To Node Backend
# ============================================================

def send_scan(
    uid: str,
    action: str = "inventory",
    reader_id: str = DEFAULT_READER_ID,
    scan_endpoint: str = SCAN_ENDPOINT,
    notes: Optional[str] = None,
):
    """
    Send RFID scan to Node.js backend.
    """

    payload = {
        "uid": uid.upper(),
        "action": action,
        "readerId": reader_id,
        "notes": notes or (
            f"Simulated scan from Python at "
            f"{datetime.now().isoformat()}"
        ),
    }

    try:

        response = requests.post(
            scan_endpoint,
            json=payload,
            timeout=5,
        )

        try:
            data = response.json()
        except ValueError:
            data = {
                "success": False,
                "message": response.text,
            }

        if (
            response.status_code == 200
            and data.get("success")
        ):

            tag = (
                data
                .get("data", {})
                .get("tag", {})
            )

            asset = (
                data
                .get("data", {})
                .get("scan", {})
                .get("asset")
            )

            asset_name = (
                asset.get("name")
                if isinstance(asset, dict)
                else "N/A"
            )

            result = {
                "success": True,
                "uid": uid.upper(),
                "action": action,
                "asset": asset_name,
                "scanCount": tag.get(
                    "scanCount",
                    None
                ),
                "backend": data,
            }

            print(
                f"✅ [{datetime.now().strftime('%H:%M:%S')}] "
                f"SCAN OK | "
                f"UID: {uid} | "
                f"Action: {action} | "
                f"Asset: {asset_name}"
            )

            return result

        else:

            message = data.get(
                "message",
                "Unknown backend error"
            )

            print(
                f"❌ [{datetime.now().strftime('%H:%M:%S')}] "
                f"SCAN FAIL | "
                f"UID: {uid} | "
                f"{message}"
            )

            return {
                "success": False,
                "uid": uid.upper(),
                "action": action,
                "message": message,
                "backend": data,
            }

    except requests.exceptions.ConnectionError:

        print(
            f"🔌 Cannot connect to backend: "
            f"{scan_endpoint}"
        )

        return {
            "success": False,
            "uid": uid.upper(),
            "action": action,
            "message": (
                "Cannot connect to Node.js backend"
            ),
        }

    except requests.exceptions.Timeout:

        print(
            f"⏱️ Backend request timed out: "
            f"{scan_endpoint}"
        )

        return {
            "success": False,
            "uid": uid.upper(),
            "action": action,
            "message": "Backend request timed out",
        }

    except Exception as e:

        print(
            f"💥 Error: {str(e)}"
        )

        return {
            "success": False,
            "uid": uid.upper(),
            "action": action,
            "message": str(e),
        }


# ============================================================
# FastAPI Routes
# ============================================================

@app.get("/")
def root():

    return {
        "success": True,
        "service": "RFID Simulator",
        "version": "1.0.0",
        "status": "running",
        "backend": API_BASE,
        "docs": "/docs",
    }


# ============================================================
# Health Check
# ============================================================

@app.get("/health")
def health():

    return {
        "success": True,
        "status": "healthy",
        "service": "RFID Simulator",
        "timestamp": datetime.now().isoformat(),
    }


# ============================================================
# Scan RFID
# ============================================================

@app.post("/scan")
def scan_rfid(request: ScanRequest):

    uid = request.uid.strip().upper()

    if not uid:
        raise HTTPException(
            status_code=400,
            detail="UID is required",
        )

    if request.action not in ACTIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid action. "
                f"Allowed: {ACTIONS}"
            ),
        )

    result = send_scan(
        uid=uid,
        action=request.action,
        reader_id=request.readerId,
        notes=request.notes,
    )

    if not result.get("success"):

        raise HTTPException(
            status_code=502,
            detail=result,
        )

    return result


# ============================================================
# Random Known RFID Scan
# ============================================================

@app.post("/scan/random")
def random_scan(
    request: RandomScanRequest
):

    uid = random.choice(
        KNOWN_UIDS
    )

    result = send_scan(
        uid=uid,
        action=request.action,
        reader_id=request.readerId,
    )

    if not result.get("success"):

        raise HTTPException(
            status_code=502,
            detail=result,
        )

    return result


# ============================================================
# Unknown RFID Scan
# ============================================================

@app.post("/scan/unknown")
def unknown_scan(
    request: RandomScanRequest
):

    uid = random.choice(
        UNKNOWN_UIDS
    )

    result = send_scan(
        uid=uid,
        action=request.action,
        reader_id=request.readerId,
    )

    if not result.get("success"):

        raise HTTPException(
            status_code=502,
            detail=result,
        )

    return result


# ============================================================
# Generate Random UID
# ============================================================

@app.get("/generate-uid")
def generate_uid():

    uid = generate_random_uid()

    return {
        "success": True,
        "uid": uid,
    }


# ============================================================
# Get Known UIDs
# ============================================================

@app.get("/uids")
def get_uids():

    return {
        "success": True,
        "known": KNOWN_UIDS,
        "unknown": UNKNOWN_UIDS,
    }


# ============================================================
# CLI Interactive Mode
# ============================================================

def interactive_mode():

    print(
        "\n" + "=" * 50
    )

    print(
        "  RFID SIMULATOR - Interactive Mode"
    )

    print(
        "=" * 50
    )

    print("Commands:")
    print("  <UID>          - Scan a specific UID")
    print("  random         - Scan random known UID")
    print("  unknown        - Scan unknown UID")
    print("  generate       - Generate random UID")
    print("  list            - Show known UIDs")
    print("  quit / exit    - Exit")

    print(
        "=" * 50 + "\n"
    )

    while True:

        try:

            cmd = input(
                "RFID> "
            ).strip()

            if not cmd:
                continue

            if cmd.lower() in (
                "quit",
                "exit",
                "q",
            ):

                print(
                    "Goodbye!"
                )

                break

            if cmd.lower() == "list":

                print(
                    "Known UIDs:",
                    ", ".join(KNOWN_UIDS)
                )

                continue

            if cmd.lower() == "generate":

                uid = generate_random_uid()

                print(
                    f"Generated UID: {uid}"
                )

                continue

            if cmd.lower() == "random":

                uid = random.choice(
                    KNOWN_UIDS
                )

                action = random.choice(
                    ACTIONS
                )

                send_scan(
                    uid,
                    action,
                )

                continue

            if cmd.lower() == "unknown":

                uid = random.choice(
                    UNKNOWN_UIDS
                )

                send_scan(
                    uid,
                    "inventory",
                )

                continue

            # Manual UID

            action = random.choice(
                ACTIONS
            )

            send_scan(
                cmd.upper(),
                action,
            )

        except KeyboardInterrupt:

            print(
                "\nGoodbye!"
            )

            break


# ============================================================
# CLI Main
# ============================================================

def main():

    parser = argparse.ArgumentParser(
        description="RFID Tag Scan Simulator"
    )

    parser.add_argument(
        "--uid",
        type=str,
        help="Scan a specific UID",
    )

    parser.add_argument(
        "--action",
        type=str,
        default="inventory",
        choices=ACTIONS,
        help="Scan action",
    )

    parser.add_argument(
        "--random",
        type=int,
        metavar="N",
        help="Simulate N random scans",
    )

    parser.add_argument(
        "--loop",
        type=int,
        metavar="SECONDS",
        help="Continuous scanning every N seconds",
    )

    parser.add_argument(
        "--api",
        type=str,
        default=API_BASE,
        help="API base URL",
    )

    args = parser.parse_args()

    api_base = args.api.rstrip("/")

    scan_endpoint = (
        f"{api_base}/rfid/scan"
    )

    print(
        f"RFID Simulator | "
        f"Backend: {api_base}"
    )

    # Specific UID

    if args.uid:

        send_scan(
            uid=args.uid,
            action=args.action,
            scan_endpoint=scan_endpoint,
        )

        return

    # Random scans

    if args.random:

        print(
            f"Simulating "
            f"{args.random} random scans...\n"
        )

        for _ in range(args.random):

            uid = random.choice(
                KNOWN_UIDS + UNKNOWN_UIDS[:2]
            )

            action = random.choice(
                ACTIONS
            )

            send_scan(
                uid=uid,
                action=action,
                scan_endpoint=scan_endpoint,
            )

            time.sleep(0.5)

        return

    # Continuous loop

    if args.loop:

        print(
            f"Continuous mode: "
            f"every {args.loop} seconds"
        )

        try:

            while True:

                uid = random.choice(
                    KNOWN_UIDS
                )

                action = random.choice(
                    ACTIONS
                )

                send_scan(
                    uid=uid,
                    action=action,
                    scan_endpoint=scan_endpoint,
                )

                time.sleep(
                    args.loop
                )

        except KeyboardInterrupt:

            print(
                "\nStopped."
            )

        return

    # Interactive mode

    interactive_mode()


# ============================================================
# Entry Point
# ============================================================

if __name__ == "__main__":

    main()