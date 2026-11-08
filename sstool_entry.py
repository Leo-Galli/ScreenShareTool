"""PyInstaller entry — import as package so relative imports in __main__ work."""
from screenshare_tool.__main__ import main

if __name__ == "__main__":
    main()
