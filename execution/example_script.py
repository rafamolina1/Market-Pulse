#!/usr/bin/env python3
"""
Example Execution Script Template

This script demonstrates the structure and best practices for execution scripts.
All execution scripts should be:
- Deterministic and reliable
- Well-commented
- Include error handling
- Use environment variables for configuration
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def main():
    """
    Main execution function.
    """
    try:
        # Get configuration from environment variables
        # Example: api_key = os.getenv('API_KEY_NAME')
        
        print("Starting execution...")
        
        # Your deterministic logic here
        result = process_data()
        
        # Save results
        save_results(result)
        
        print("Execution completed successfully!")
        return 0
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        return 1


def process_data():
    """
    Process data deterministically.
    
    Returns:
        dict: Processed data
    """
    # Your processing logic here
    result = {
        "status": "success",
        "data": "example data"
    }
    return result


def save_results(data, filename=".tmp/output.json"):
    """
    Save results to file.
    
    Args:
        data: Data to save
        filename: Output file path (default in .tmp/)
    """
    # Ensure .tmp directory exists
    Path(".tmp").mkdir(exist_ok=True)
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Results saved to: {filename}")


if __name__ == "__main__":
    sys.exit(main())
