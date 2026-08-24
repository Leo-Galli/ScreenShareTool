"""
CharlieRP ScreenShareTool v3.0 — Setup
"""

from setuptools import setup, find_packages

setup(
    name="screenshare-tool",
    version="3.0.0",
    description="CharlieRP ScreenShareTool — Analisi forense anti-cheat per Minecraft",
    long_description=open("README.md", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    author="LeoGalli",
    url="https://github.com/Leo-Galli/ScreenShareTool",
    packages=find_packages(),
    python_requires=">=3.8",
    entry_points={
        "console_scripts": [
            "screenshare-tool=screenshare_tool.__main__:main",
        ],
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: End Users/Desktop",
        "License :: OSI Approved :: MIT License",
        "Operating System :: Microsoft :: Windows",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Security",
    ],
)
