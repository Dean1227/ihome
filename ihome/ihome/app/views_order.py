from flask import render_template, session, jsonify, request
from flask.blueprints import Blueprint

from app.models import House, Order
from utils.function import is_login

blue_order = Blueprint('order', __name__)


@blue_order.route('/booking/', methods=['GET'])
@is_login
def booking():
    return render_template('booking.html')


@blue_order.route('/my_booking/', methods=['GET'])
@is_login
def my_booking():
    house_id = session['house_id']
    house = House.query.filter(House.id == house_id).first()
    house = house.to_dict()
    return jsonify({'code': 200, 'msg': '请求成功', 'house': house})


@blue_order.route('/booking/', methods=['POST'])
@is_login
def order_booking():
    order = Order()
    order.house_id = session['house_id']
    order.user_id = session['id']
    order.begin_date = request.form.get('sd')
    order.end_date = request.form.get('ed')
    order.house_price = request.form.get('price')
    order.amount = request.form.get('amount')
    order.days = request.form.get('days')
    order.save()
    return jsonify({'code': 200, 'msg': '请求成功'})


# 我的订单
@blue_order.route('/my_order/', methods=['GET'])
@is_login
def order():
    return render_template('orders.html')


@blue_order.route('/orders/', methods=['GET'])
@is_login
def orders():
    user_id = session['id']
    orders = Order.query.filter(Order.user_id == user_id).all()
    all_orders = []
    for order in orders:
        order = order.to_dict()
        order['order_id'] = str(order['order_id']).rjust(8, '0')
        if order['status'] == 'WAIT_ACCEPT':
            order['status'] = '待接单'
        elif order['status'] == 'WAIT_PAYMENT':
            order['status'] = '待支付'
        elif order['status'] == 'PAID':
            order['status'] = '已支付'
        elif order['status'] == 'WAIT_COMMENT':
            order['status'] = '待评价'
        elif order['status'] == 'COMPLETE':
            order['status'] = '已完成'
        elif order['status'] == 'CANCELED':
            order['status'] = '已取消'
        elif order['status'] == 'REJECTED':
            order['status'] = '已拒单'
        print(order, '==========')
        all_orders.append(order)
    return jsonify({'code': 200, 'msg': '请求成功', 'orders': all_orders})


# 订单评价
@blue_order.route('/my_order/', methods=['POST'])
@is_login
def my_order():
    order_id = int(request.form.get('order_id'))
    comment = request.form.get('comment')
    order = Order.query.filter(Order.id == order_id).first()
    order.comment = comment
    order.status = 'COMPLETE'
    order.save()
    return jsonify({'code': 200, 'msg': '请求成功'})


# 客户订单
@blue_order.route('/lorders/', methods=['GET'])
@is_login
def lorders():
    return render_template('lorders.html')


@blue_order.route('/lorder/', methods=['GET'])
@is_login
def lorder():
    user_id = session['id']
    # 获取当前登录用户自己的所有房源
    houses = House.query.filter(House.user_id == user_id).all()
    house_id_list = []
    for house in houses:
        house_id = house.id
        house_id_list.append(house_id)
    orders = Order.query.filter(Order.house_id.in_(house_id_list)).all()
    all_orders = []
    for order in orders:
        order = order.to_dict()
        order['order_id'] = str(order['order_id']).rjust(8, '0')
        if order['status'] == 'WAIT_ACCEPT':
            order['status'] = '待接单'
        elif order['status'] == 'WAIT_PAYMENT':
            order['status'] = '待支付'
        elif order['status'] == 'PAID':
            order['status'] = '已支付'
        elif order['status'] == 'WAIT_COMMENT':
            order['status'] = '待评价'
        elif order['status'] == 'COMPLETE':
            order['status'] = '已完成'
        elif order['status'] == 'CANCELED':
            order['status'] = '已取消'
        elif order['status'] == 'REJECTED':
            order['status'] = '已拒单'
        all_orders.append(order)
    return jsonify({'code': 200, 'msg': '请求成功', 'orders': all_orders})


# 接单
@blue_order.route('/accept_order/', methods=['POST'])
@is_login
def accept_order():
    order_id = int(request.form.get('order_id'))
    order = Order.query.filter(Order.id == order_id).first()
    order.status = request.form.get('status')
    order.save()
    return jsonify({'code': 200, 'msg': '请求成功'})


# 拒单
@blue_order.route('/reject_order/', methods=['POST'])
@is_login
def reject_order():
    order_id = int(request.form.get('order_id'))
    order = Order.query.filter(Order.id == order_id).first()
    order.status = request.form.get('status')
    order.comment = request.form.get('reason')
    order.save()
    return jsonify({'code': 200, 'msg': '请求成功'})