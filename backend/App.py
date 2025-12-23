import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import google.generativeai as genai
from werkzeug.utils import secure_filename
from Option_01 import forecast_next_30_days as forecast_single_cat
from Option_02 import predict_manual_week
from option_03 import forecast_next_30_days as forecast_all_cats
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(BASE_DIR, '.env')
load_dotenv(dotenv_path)
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ ERROR: GEMINI_API_KEY not found in .env")
else:
    print(f"✅ API Key loaded: {api_key[:5]}...")
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'DataSets')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

# Gemini Configuration
genai.configure(api_key=api_key)
gemini_model = genai.GenerativeModel('gemini-2.5-flash')

def get_business_inference(prediction_data, category):
    try:
        if isinstance(prediction_data, str):
            return "Prophet could not analyze data due to an error."
            
        prompt = f"""
        You are a retail supply chain expert. 
        I have predicted the following daily demand for {category} over the next 7 days:
        {str(prediction_data)[:2000]}
        
        Based on these numbers, give me a concise 2-3 sentence business insight. 
        Start with "The Prophet says that..."
        """
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        return "The Prophet is currently meditating (AI Service Error)."

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        #handles all file related issues first
        if 'file' in request.files:
            file = request.files['file']
            option = int(request.form.get('option', 3))
            
            if file.filename == '':
                return jsonify({"error": "No file selected"}), 400

            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            col_map = {
                'date': request.form.get('dateColumn'),
                'demand': request.form.get('demandColumn'),
                'category': request.form.get('categoryColumn')
            }
            if option == 1:
                cat_name = request.form.get('categoryName')
                results = forecast_single_cat(filepath, cat_name, col_map)
                type_str = "File Upload Forecast (Single)"
            else:
                results = forecast_all_cats(filepath, col_map)
                type_str = "File Upload Forecast (Full)"
            if isinstance(results, str):
                return jsonify({"error": results}), 400
            if isinstance(results, pd.DataFrame):
                if 'DateTime' in results.columns:
                    results['DateTime'] = results['DateTime'].astype(str)
                json_results = results.to_dict(orient='records')
            elif isinstance(results, list):
                json_results = results
            else:
                return jsonify({"error": f"Unexpected data type: {type(results)}"}), 500

            inference = get_business_inference(json_results[:5], "Uploaded Data")
            return jsonify({"type": type_str, "results": json_results, "inference": inference})
        content = request.get_json()
        if not content or 'option' not in content:
            return jsonify({"error": "Missing selection option"}), 400
        option = content.get('option')
        user_data = content.get('data', {})
        col_map = content.get('col_map', None)
        if option == 1:
            raw_filename = user_data.get('dataset', 'ds1.pkl')
            filename = os.path.basename(raw_filename)
            dataset_path = os.path.join(BASE_DIR, 'DataSets', filename)
            
            print(f"DEBUG: Looking for file at -> {dataset_path}") 

            if not os.path.exists(dataset_path):
                return jsonify({"error": f"Dataset not found at {dataset_path}"}), 404

            category = user_data.get('category')
            results = forecast_single_cat(dataset_path, category, col_map)
            
            if isinstance(results, str): 
                 return jsonify({"error": results}), 400

            inference = get_business_inference(results, category)
            
            return jsonify({
                "type": "Single Category Forecast", 
                "results": results, 
                "inference": inference
            })
        elif option == 2:
            start_date = user_data.get('start_date')
            sales_data = user_data.get('sales_data')
            raw_results = predict_manual_week(start_date, sales_data)
            
            if isinstance(raw_results, str): 
                return jsonify({"error": raw_results}), 400
            
            formatted_results = []
            for item in raw_results:
                if isinstance(item, (list, tuple)) and len(item) == 2:
                    formatted_results.append({"Date": item[0], "Demand": item[1]})
                else:
                    formatted_results.append({"Date": "Unknown", "Demand": item})
            
            inference = get_business_inference(formatted_results, "Manual Entry")
            return jsonify({
                "type": "Manual Entry Forecast",
                "results": formatted_results,
                "inference": inference 
            })
        elif option == 3:
            raw_filename = user_data.get('dataset', 'ds1.pkl')
            filename = os.path.basename(raw_filename)
            dataset_path = os.path.join(BASE_DIR, 'DataSets', filename)

            if not os.path.exists(dataset_path):
                return jsonify({"error": f"Dataset not found at {dataset_path}"}), 404

            df_results = forecast_all_cats(dataset_path, col_map)
            
            if isinstance(df_results, str):
                return jsonify({"error": df_results}), 400
                
            if 'DateTime' in df_results.columns:
                df_results['DateTime'] = df_results['DateTime'].astype(str)
                
            json_results = df_results.to_dict(orient='records')
            inference = get_business_inference(json_results[:10], "All Categories")
            
            return jsonify({
                "type": "Full Catalog Forecast", 
                "results": json_results,
                "inference": inference
            })
    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)