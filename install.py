import launch

if not launch.is_installed("pandas"):
    launch.run_pip(f"install pandas", "pandas")
