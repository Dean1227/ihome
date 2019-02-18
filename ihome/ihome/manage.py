
from flask import Flask, redirect, url_for
from flask_script import Manager

from app.models import db


from app.views_order import blue_order
from app.views_user import blue_user
from app.views_house import blue_house

app = Flask(__name__)


app.register_blueprint(blueprint=blue_user, url_prefix='/user')
app.register_blueprint(blueprint=blue_order, url_prefix='/order')
app.register_blueprint(blueprint=blue_house, url_prefix='/house')


@app.route('/')
def home_index():
	return redirect(url_for('house.index'))


app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@120.79.72.125:3306/flask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

app.secret_key = '231dasdasdas123as1wqzxczcdqasdazx'

manage = Manager(app)


if __name__ == '__main__':
    manage.run()