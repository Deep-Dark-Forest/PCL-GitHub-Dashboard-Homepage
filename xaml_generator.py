import json
import requests
from pathlib import Path
from tqdm import tqdm

def load_template():
    return Path("template.xaml").read_text(encoding="utf-8")

def fetch_data(url):
    try:
        if ';' in url:
            urls = url.split(';')
            total = 0
            for u in urls:
                response = requests.get(u, timeout=10)
                response.raise_for_status()
                value = response.text.strip()
                try:
                    total += int(value)
                except ValueError:
                    print(f"Warning: Non-integer value '{value}' from {u}, using 0")
            return str(total)
        else:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.text.strip()
    except Exception as e:
        print(f"Error fetching {url}: {str(e)}")
        return "0"

def generate_xaml():
    with open("data_mapping.json", encoding="utf-8") as f:
        mappings = json.load(f)
    
    data = {}
    for key, url in tqdm(mappings.items(), desc="Downloading data"):
        data[key] = fetch_data(url)
    
    template = load_template()
    for key, value in data.items():
        template = template.replace(f"{{{{{key}}}}}", value)
    
    Path("Custom.xaml").write_text(template, encoding="utf-8")
    print("XAML generated successfully!")

if __name__ == "__main__":
    generate_xaml()
