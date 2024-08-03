import launch
import os
import pkg_resources
from modules import scripts
import sys

module_path = f"{os.path.join(os.path.dirname(os.path.realpath(__file__)), 'intelli_prompt')}"

req_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), "requirements.txt")

# from controlnet
with open(req_file) as file:
    for package in file:
        try:
            package = package.strip()
            if '==' in package:
                package_name, package_version = package.split('==')
                installed_version = pkg_resources.get_distribution(package_name).version
                if installed_version != package_version:
                    launch.run_pip(f"install {package}", f"a1111-suggestion requirement: changing {package_name} version from {installed_version} to {package_version}")
            elif not launch.is_installed(package):
                launch.run_pip(f"install {package}", f"a1111-suggestion requirement: {package}")
        except Exception as e:
            print(e)
            print(f'Warning: Failed to install {package}, something may not work.')

if not launch.is_installed("intelli_suggetion"):
    launch.run_pip(f"install {module_path}")
