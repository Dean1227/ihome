import os
from datetime import datetime

from flask import request, render_template, session, jsonify
from flask.blueprints import Blueprint

from app.models import User, Area, House, Facility, Order, HouseImage
from utils.function import is_login

blue_house = Blueprint('house', __name__)


# 渲染首页
@blue_house.route('/index/', methods=['GET'])
def index():
    return render_template('index.html')


# 首页显示资源
@blue_house.route('/my_index/', methods=['GET'])
def my_index():
    user = ''
    user_id = session.get('id')
    if user_id:
        user = User.query.filter(User.id == user_id).first()
        # 判断用户是否登录
        user = user.to_basic_dict()
    # 获取地区详情
    area_list = []
    areas = Area.query.all()
    for area in areas:
        area = area.to_dict()
        area_list.append(area)
    return jsonify({'code': 200, 'msg': '请求成功', 'user': user, 'area_list': area_list})


@blue_house.route('/index/', methods=['POST'])
def s_index():
    session['start_date'] = request.form.get('start_date')
    session['end_date'] = request.form.get('end_date')
    session['area_id'] = request.form.get('area_id')
    return jsonify({'code': 200, 'msg': '请求成功'})


# 渲染搜索界面
@blue_house.route('/search/', methods=['GET'])
def search():
    return render_template('search.html')


@blue_house.route('/hsearch/', methods=['GET'])
def h_search():
    # 获取当前登录用户
    user_id = session.get('id')
    # 获取地区信息
    area_list = []
    areas = Area.query.all()
    for area in areas:
        area = area.to_dict()
        area_list.append(area)
    #  根据输入条件获取房屋信息
    area_id = session.get('area_id')
    area = Area.query.filter(Area.id == area_id).first()
    area = area.to_dict()
    order_status = ['REJECTED', 'CANCELED', 'COMPLETE']
    all_houses = []
    start_date = datetime.strptime(session.get('start_date'), '%Y-%m-%d')
    end_date = datetime.strptime(session.get('end_date'), '%Y-%m-%d')
    # 转换查询相关的条件
    orders_list = Order.query.filter(Order.status.notin_(order_status)).all()
    orders1_list = Order.query.filter(Order.begin_date >= start_date, Order.end_date <= end_date).all()
    orders2_list = Order.query.filter(Order.begin_date < start_date, Order.end_date > end_date).all()
    orders3_list = Order.query.filter(Order.end_date >= start_date, Order.end_date <= end_date).all()
    orders4_list = Order.query.filter(Order.begin_date >= start_date, Order.begin_date <= end_date).all()
    for order1 in orders1_list:
        if order1 not in orders_list:
            orders_list.append(order1)
    for order2 in orders2_list:
        if order2 not in orders_list:
            orders_list.append(order2)
    for order3 in orders3_list:
        if order3 not in orders_list:
            orders_list.append(order3)
    for order4 in orders4_list:
        if order4 not in orders_list:
            orders_list.append(order4)
    order_houses_id = []
    for order in orders_list:
        order_house_id = order.house_id
        order_houses_id.append(order_house_id)
        # 查询满足条件的房源
    houses = House.query.filter(House.area_id == area_id, House.id.notin_(order_houses_id)).order_by('-id').all()
    if user_id:
        houses = House.query.filter(House.area_id == area_id, House.id.notin_(order_houses_id),
                                    House.user_id != user_id).order_by('-id').all()
    for house in houses:
        house = house.to_full_dict()
        all_houses.append(house)
    start_date = session.get('start_date')
    end_date = session.get('end_date')
    return jsonify({'code': 200, 'msg': '请求成功', 'all_houses': all_houses, 'area_list': area_list,
                    'start_date': start_date, 'end_date': end_date, 'area': area})


# 待完善的搜索功能
@blue_house.route('/my_search/', methods=['POST'])
def my_search():
    # 获取当前登录用户(待完善屏蔽当前用户)
    user_id = session.get('id')
    # 获取地区信息
    area_list = []
    areas = Area.query.all()
    for area in areas:
        area = area.to_dict()
        area_list.append(area)
    #  根据输入条件获取房屋信息
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    area_id = request.form.get('area_id')
    sort_key = request.form.get('key')
    order_status = ['REJECTED', 'CANCELED', 'COMPLETE']
    all_houses = []
    # if start_date and end_date:
    #     session['start_date'] = start_date
    #     session['end_date'] = end_date
    # start_date = session.get('start_date')
    # end_date = session.get('end_date')
    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.strptime(end_date, '%Y-%m-%d')
    # 转换查询相关的条件
    orders_list = Order.query.filter(Order.status.notin_(order_status)).all()
    orders1_list = Order.query.filter(Order.begin_date >= start_date, Order.end_date <= end_date).all()
    orders2_list = Order.query.filter(Order.begin_date < start_date, Order.end_date > end_date).all()
    orders3_list = Order.query.filter(Order.end_date >= start_date, Order.end_date <= end_date).all()
    orders4_list = Order.query.filter(Order.begin_date >= start_date, Order.begin_date <= end_date).all()
    for order1 in orders1_list:
        if order1 not in orders_list:
            orders_list.append(order1)
    for order2 in orders2_list:
        if order2 not in orders_list:
            orders_list.append(order2)
    for order3 in orders3_list:
        if order3 not in orders_list:
            orders_list.append(order3)
    for order4 in orders4_list:
        if order4 not in orders_list:
            orders_list.append(order4)
    order_houses_id = []
    for order in orders_list:
        order_house_id = order.house_id
        order_houses_id.append(order_house_id)
        # 查询满足条件的房源
    houses = House.query.filter(House.area_id == area_id, House.id.notin_(order_houses_id)).order_by('-id').all()
    if sort_key == 'new':
        houses = houses
    elif sort_key == 'booking':
        houses = House.query.filter(House.area_id == area_id, House.id.notin_(order_houses_id)).order_by('-order_count').all()
    elif sort_key == 'price-inc':
        houses = House.query.filter(House.area_id == area_id, House.id.notin_(order_houses_id)).order_by('price').all()
    elif sort_key == 'price-des':
        houses = House.query.filter(House.area_id == area_id, House.id.notin_(order_houses_id)).order_by('-price').all()
    for house in houses:
        house = house.to_full_dict()
        all_houses.append(house)
    return jsonify({'code': 200, 'msg': '请求成功', 'all_houses': all_houses, 'area_list': area_list})


# 渲染房屋详情页
@blue_house.route('/detail/<int:id>/', methods=['GET'])
def detail(id):
    session['house_id'] = id
    return render_template('detail.html')


@blue_house.route('/my_detail/', methods=['GET'])
def my_detail():
    user_id = session.get('id')
    house = House.query.filter(House.id == session['house_id']).first()
    flag = 1
    if user_id and user_id == house.user_id:
        house = house.to_full_dict()
        flag = 0
        return jsonify({'code': 200, 'msg': '请求成功', 'house': house, 'booking': flag})
    house = house.to_full_dict()
    return jsonify({'code': 200, 'msg': '请求成功', 'house': house, 'booking': flag})


# 我的房源
@blue_house.route('/my_house/', methods=['GET'])
@is_login
def my_house():
    return render_template('myhouse.html')


@blue_house.route('/my_houses/', methods=['GET'])
@is_login
def my_houses():
    user = User.query.filter(User.id == session['id']).first()
    if user.id_card and user.id_name:
        houses = House.query.filter(House.user_id == user.id).all()
        all_houses = []
        for house in houses:
            house = house.to_dict()
            all_houses.append(house)
        return jsonify({'code': 200, 'houses': all_houses, 'msg': '请求成功'})
    return jsonify({'code': 1001, 'msg': '用户未实名认证'})


# 渲染发布房源页面
@blue_house.route('/new_house/', methods=['GET'])
@is_login
def new_house():
    return render_template('newhouse.html')


@blue_house.route('/my_new_house/', methods=['GET'])
@is_login
def my_new_house():
    # 获取地区详情
    area_list = []
    areas = Area.query.all()
    for area in areas:
        area = area.to_dict()
        area_list.append(area)
    return jsonify({'code': 200, 'msg': '请求成功', 'area_list': area_list})


# 发布房源
@blue_house.route('/new_house/', methods=['POST'])
@is_login
def new_my_house():
    # 获取当前登录的用户id
    user_id = session['id']
    # 创建房屋对象
    house = House()
    house.user_id = user_id
    house.title = request.form.get('title')
    house.price = request.form.get('price')
    house.area_id = request.form.get('area_id')
    house.address = request.form.get('address')
    house.room_count = request.form.get('room_count')
    house.acreage = request.form.get('acreage')
    house.unit = request.form.get('unit')
    house.capacity = request.form.get('capacity')
    house.beds = request.form.get('beds')
    house.deposit = request.form.get('deposit')
    house.min_days = request.form.get('min_days')
    house.max_days = request.form.get('max_days')
    facilities = request.form.getlist('facility')
    # 保存到数据库中
    for facility_id in facilities:
        facility = Facility.query.filter(Facility.id == facility_id).first()
        house.facilities.append(facility)
    house.save()
    session['new_house_id'] = house.id
    return jsonify({'code': 200, 'msg': '请求成功'})


@blue_house.route('/new_house_img/', methods=['POST'])
@is_login
def new_house_img():
    # 创建房屋图片对象
    house_image = HouseImage()
    # 获取房屋对象
    house = House.query.filter(House.id == session['new_house_id']).first()
    # 获取房屋图片
    house_img = request.files['house_image']
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    UPLOAD_FOLDER = os.path.join(os.path.join(BASE_DIR, 'static'), 'upload')
    url = os.path.join(UPLOAD_FOLDER, house_img.filename)
    house_img.save(url)
    # 保存房屋图片
    house_image.house_id = house.id
    house_image.url = os.path.join('/static/upload', house_img.filename)
    house_image.save()
    # 判断是否存在房源首页图片，没有则保存
    if not house.index_image_url:
        house.index_image_url = os.path.join('/static/upload', house_img.filename)
        house.save()
    return jsonify({'code': 200, 'msg': '请求成功'})