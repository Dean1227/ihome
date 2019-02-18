import os
import random
import re

from flask import request, render_template, url_for, redirect, jsonify, session
from flask.blueprints import Blueprint

from app.models import User
from utils.function import is_login

blue_user = Blueprint('user', __name__)


# 用户界面功能
# 注册
@blue_user.route('/register/', methods=['GET'])
def register():
    return render_template('register.html')


@blue_user.route('/register/', methods=['POST'])
def my_register():
    # 获取参数
    mobile = request.form.get('mobile')
    imagecode = request.form.get('imagecode')
    password1 = request.form.get('passwd')
    password2 = request.form.get('passwd2')
    # 1.验证参数是否都填写正确
    if not all([mobile, imagecode, password1, password2]):
        return jsonify({'code': 1001, 'msg': '请填写完整的参数'})
    # 2.验证手机号码正确
    if not re.match('^1[3456789]\d{9}$', mobile):
        return jsonify({'code': 1002, 'msg': '请填写正确手机号'})
    # 3.验证图片验证码
    if session['img_code'] != imagecode:
        return jsonify({'code': 1003, 'msg': '请填写正确验证码'})
    # 4.密码和确认密码是否一致
    if password1 != password2:
        return jsonify({'code': 1004, 'msg': '两次密码不一致'})
    # 验证手机号是否被注册
    user = User.query.filter(User.phone == mobile).first()
    if user:
        return jsonify({'code': 1005, 'msg': '该手机号已注册，请直接登录或者更换手机注册'})
    # 创建注册信息
    user = User()
    user.phone = mobile
    user.name = mobile
    user.password = password1
    user.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


# 验证码
@blue_user.route('/code/', methods=['GET'])
def get_code():
    # 获取验证码
    # 方式1：后端生成图片，并返回验证码图片的地址（不推荐）
    # 方式2：后端只生成随机参数，并返回给页面，在页面中生成图片（前端做）
    s = '123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    code = ''
    for i in range(4):
        code += random.choice(s)
    session['img_code'] = code
    return jsonify({'code': 200, 'msg': '请求成功', 'data': code})


# 登录
@blue_user.route('/login/', methods=['GET'])
def login():
    return render_template('login.html')


@blue_user.route('/login/', methods=['POST'])
def my_login():
    mobile = request.form.get('mobile')
    password = request.form.get('passwd')
    user = User.query.filter(User.phone == mobile).first()
    if user:
        if user.check_pwd(password):
            session['id'] = user.id
            return jsonify({'code': 200, 'msg': '请求成功'})
        else:
            return jsonify({'code': 1001, 'msg': '密码错误'})
    else:
        return jsonify({'code': 1002, 'msg': '账号不存在'})


# 用户信息
@blue_user.route('/my/', methods=['GET'])
@is_login
def my():
    return render_template('my.html')


@blue_user.route('/my_info/', methods=['GET'])
@is_login
def my_info():
    user_id = session['id']
    user = User.query.filter(User.id == user_id).first()
    user = user.to_basic_dict()
    return jsonify({'code': 200, 'msg': '请求成功', 'user': user})


# 登出
@blue_user.route('/logout/', methods=['GET', 'POST'])
@is_login
def logout():
    session.clear()
    return redirect(url_for('house.index'))


# 修改界面
@blue_user.route('/profile/', methods=['GET'])
@is_login
def profile():
    return render_template('profile.html')


@blue_user.route('/profile/', methods=['POST'])
@is_login
def my_profile():
    user_id = session['id']
    user = User.query.filter(User.id == user_id).first()
    dict_file = request.files
    print(dict_file)
    if 'avatar' in dict_file:
        try:
            # 获取头像文件
            avatar = request.files['avatar']
            print(avatar.filename)
            BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            print(BASE_DIR)
            UPLOAD_FOLDER = os.path.join(os.path.join(BASE_DIR, 'static'), 'upload')
            print(UPLOAD_FOLDER)
            url = os.path.join(UPLOAD_FOLDER, avatar.filename)
            print(url)
            avatar.save(url)
        except:
            return jsonify({})
        user.avatar = os.path.join('/static/upload', avatar.filename)
        print(user.avatar)
        user.add_update()
        return jsonify({'code': 200, 'msg': '请求成功'})
    user_name = request.form.get('user_name')

    if user_name:
        user.name = user_name
        user.add_update()
        return jsonify({'code': 200, 'msg': '请求成功'})
    return jsonify({'code': 1001, 'msg': '操作失败'})


# 实名认证界面
@blue_user.route('/auth/', methods=['GET'])
@is_login
def auth():
    return render_template('auth.html')


@blue_user.route('/auth/', methods=['POST'])
@is_login
def my_auth():
    user_id = session['id']
    user = User.query.filter(User.id == user_id).first()
    name = request.form.get('real_name')
    card = request.form.get('id_card')
    user.id_name = name
    user.id_card = card
    user.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


# 判断是否实名认证
@blue_user.route('/is_auth/', methods=['GET'])
def is_auth():
    user = User.query.filter(User.id == session['id']).first()
    if user.id_card and user.id_name:
        user.id_name = '**' + user.id_name[-1]
        print(user.id_name)
        user.id_card = user.id_card[0:3] + '************'+user.id_card[16:19]
        print(user.id_card)
        user = user.to_auth_dict()
        return jsonify({'code': 200, 'msg': '用户已经实名', 'user': user})
