import requests
import time

BASE_URL = "http://127.0.0.1:5000"

def test_ping():
    print("🔹 Testing /ping ...")
    start = time.time()
    res = requests.get(f"{BASE_URL}/ping")
    latency = (time.time() - start) * 1000  # ms
    print("Response:", res.json())
    print(f"Measured latency: {latency:.2f} ms\n")


def test_download():
    print("🔹 Testing /download ...")
    start = time.time()
    res = requests.get(f"{BASE_URL}/download")
    duration = time.time() - start
    size_bytes = len(res.content)
    speed_mbps = (size_bytes * 8 / duration) / 1_000_000
    print(f"Downloaded {size_bytes / 1_000_000:.2f} MB in {duration:.2f} s")
    print(f"Speed: {speed_mbps:.2f} Mbps\n")


def test_upload():
    print("🔹 Testing /upload ...")
    data = b'0' * (5 * 1024 * 1024)  # 5 MB dummy data
    start = time.time()
    res = requests.post(f"{BASE_URL}/upload", data=data)
    duration = time.time() - start
    print("Server response:", res.json())
    print(f"Upload duration: {duration:.2f} s\n")


if __name__ == "__main__":
    print("🚀 Running backend endpoint tests...\n")
    test_ping()
    test_download()
    test_upload()
    print("✅ All tests completed.")
