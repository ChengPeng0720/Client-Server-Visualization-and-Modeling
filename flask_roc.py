from flask import Flask
from flask_restful import Resource, Api
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_curve
import pandas as pd
import numpy as np
from flask_cors import CORS
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
api = Api(app)
CORS(app)

class ROC(Resource):
	def get(self, preprocessing, c):
		# preprocess the data according to user preferences (only fit preprocessing on train data)
		# fit the model on the training set
		# predict probabilities on test set

		if(preprocessing == "standardization"):
			Scaler = StandardScaler()
		elif(preprocessing == "min_max_scaling"):
			Scaler = MinMaxScaler()
		else:
			return {"Warn":"This is invalid input"}

                # fit only on training set
		X_train_scaled = Scaler.fit_transform(X_train)
		X_test_scaled = Scaler.transform(X_test)


		# build logistic regression model
		LRmodel = LogisticRegression(C = float(c))
		LRmodel.fit(X_train_scaled, y_train)
		perform_score = LRmodel.predict_proba(X_test_scaled)

                # return the false positives, true positives, and thresholds using roc_curve()
		fprs, tprs, thresholds = roc_curve(y_test, perform_score[:, 1], pos_label = 1)
		result_dict = []
		for FPR, TPR, threshold in zip(fprs, tprs, thresholds):
			result_dict.append({"fpr":FPR, "tpr":TPR, "threshold":threshold})
		return result_dict

		
# add the ROC resource, ex: api.add_resource(HelloWorld, '/')
# for examples see 
# https://flask-restful.readthedocs.io/en/latest/quickstart.html#a-minimal-api

api.add_resource(ROC, "/<string:preprocessing>/<float:c>")

if __name__ == '__main__':
	# load data
	df = pd.read_csv('data/transfusion.data')
	xDf = df.loc[:, df.columns != 'Donated']
	y = df['Donated']
	# get random numbers to split into train and test
	np.random.seed(1)
	r = np.random.rand(len(df))
	# split into train test
	X_train = xDf[r < 0.8]
	X_test = xDf[r >= 0.8]
	y_train = y[r < 0.8]
	y_test = y[r >= 0.8]
	app.run(debug=True)
