import ReactDOM from 'react-dom'
import React from 'react'

import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';

import {GoodsList} from './GoodsList.js'
import {Search} from './components/Search.jsx'

var body = document.querySelector('body');
var cart = document.getElementById('cart');

var cartList = [];

var isAutorized = false;
var currentUser = {};

const carouselImages = ["./images/slider1.jpg", "./images/slider2.jpg"];

class MainLayout extends React.Component {
    render() {
        return(
            <div className="main-content">{this.props.children}</div>
        );
    }
}

class Carousel extends React.Component {
    render() {
        return(
            <div id="myCarousel" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
                    <li data-target="#myCarousel" data-slide-to="1"></li>
                </ol>
                <div className="carousel-inner" role="listbox">
                    <div className="item active">
                        <img src="./images/slider1.jpg" style={{margin: 'auto'}}/>
                    </div>

                    <div className="item">
                        <img src="./images/slider2.jpg" style={{margin: 'auto'}}/>
                    </div>
                </div>
                <a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
                    <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="right carousel-control" href="#myCarousel" role="button" data-slide="next">
                    <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        );
    }
}

class Goods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0
        }
    }

    render() {
        var pageCount = Math.floor(GoodsList.length / 4);
        var pages = [];
        for (let i = 0; i < pageCount; i++) {
            if (i == this.state.currentPage) {
                pages.push(
                    <div className="page-numbers-active" key={i} onClick={()=>{
                            this.setState({currentPage: i});
                    }}>{i+1}</div>
                );
            } else {
                pages.push(
                    <div className="page-numbers" key={i} onClick={()=>{
                            this.setState({currentPage: i});
                    }}>{i+1}</div>
                );
            }
        }

        var elemsArr = [];
        var ind = 0;
        for (let i = 0; i < pageCount; i++) {
            elemsArr.push([]);
            for (let j = 0; j < 4; j++) {
                if (GoodsList[ind] != undefined) {
                    elemsArr[i].push(GoodsList[ind]);
                } else {
                    break;
                }
                ind++;
            }
        }

        var newGoodsList = elemsArr[this.state.currentPage].map(function(item, index) {
            return (
                <div className="container" key={index}>
                    <Link to={`/goods/${item.id}`}>
                        <img src={item.photo} className="img-responsive" style={{
                            margin: 'auto',
                            marginBottom: '20%'
                        }} alt="Responsive image"/>
                        <p className="good-name">{item.goodName}</p>
                        <br/>
                        <p className="good-price">{item.price}</p>
                    </Link>
                    <button type="button" className="btn btn-primary" onClick={function() {
                            cartList.push(item);
                            document.getElementById('goods-count').innerText = cartList.length;
                            }}>Купить</button>
                </div>
            )
        });

        return (
            <div>
                <div className="goods">
                    {newGoodsList}
                </div>
                <div style={{textAlign: 'center'}}>
                    {pages}
                </div>
            </div>
        );
    }
};

class Navbar extends React.Component {
    render() {
        return(
            <div className="categories">
                {this.props.children}
            </div>
        );
    }
}

class NavItem extends React.Component {
    render() {
        return (
            <div className="category-link">
                    <Link to={this.props.path} className="link-text">
                        <div>
                            {this.props.categoryName}
                        </div>
                    </Link>
            </div>
        );
    }
}

class CartIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartList: [],
            cartListGoodCount: 0
        }
    }

    render() {
            return (
                <Link to='/cart'>
                    <i className="fa fa-shopping-cart fa-2x" aria-hidden="true"></i>
                    <p id="goods-count" className="goods-count">0</p>
                </Link>
            );
    }
}

class Cart extends React.Component {
    render() {
        var fullCartPrice = 0;
        var goodsID = [];
        var cartTable = cartList.map(function(item, index){
            let goodCount = 0;
                for (let j = 0; j < goodsID.length; j++) {
                    if (item.id == goodsID[j]) {
                        return;
                    }
                }
            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i].id == item.id) {
                    goodCount++;
                }
            }
            goodsID.push(item.id);
            let curPrice = /\d+/i.exec(item.price);
            let fullPrice = curPrice * goodCount;
            fullCartPrice += fullPrice;
            return(
                <tr>
                    <td>{item.goodName}</td>
                    <td>{item.price}</td>
                    <td>{goodCount}</td>
                    <td>{fullPrice + ' руб'}</td>
                </tr>
            );
        });

        return (
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Стоимость</th>
                            <th>Количество</th>
                            <th>Общая стоимость</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartTable}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{fullCartPrice + ' руб'}</td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Выберие способ оплаты
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li id="dropDownElem1" onClick={() => {
                                document.querySelector('.dropdown-toggle').innerText = document.getElementById('dropDownElem1').innerText;
                            }}>Visa</li>
                            <li id="dropDownElem2" onClick={() => {
                                document.querySelector('.dropdown-toggle').innerText = document.getElementById('dropDownElem2').innerText;
                            }}>MasterCard</li>
                            <li id="dropDownElem3" onClick={() => {
                                document.querySelector('.dropdown-toggle').innerText = document.getElementById('dropDownElem3').innerText;
                            }}>Maestro</li>
                        </ul>
                    </div>
                    <input className="cart-ID" type="text" placeholder="Номер карты" id="cartID" />
                    <input className="cart-info" type="text" placeholder="Срок действия карты" onLoad={() => {
                        $('#cartDate').mask('99-9999');
                    }} id="cartDate" />
                    <input className="cart-info" type="text" placeholder="Код карты" onLoad={() => {
                        $('#cartPass').mask('999');
                    }} id="cartPass" />
                    <input className="cart-ID" type="text" placeholder="Адрес доставки" />
                </div>
                <button type="button" className="btn btn-primary" onClick={() => {
                    cartList.map((item, index) => {
                        $.ajax({
                            type: "post",
                            url: '/buy',
                            data: { goodId: item.id,
                                    userlogin: currentUser.login
                            },
                            success: function(res){
                                console.log(res);
                            },
                            dataType: 'json',
                            async: false
                        });
                    });
                    cartList = [];
                    document.getElementById('goods-count').innerText = 0;
                }}><Link to='/' style={{color: "#fff"}}>Купить</Link></button>
            </div>
        )
    }
}

class UsersHistory extends React.Component {
    render() {
        var buyHistoryGoodsID;

        $.ajax({
            type: "post",
            url: '/history',
            data: {userlogin: currentUser.login},
            success: function(res) {
                buyHistoryGoodsID = res;
            },
            dataType: 'json',
            async: false
        });

        var buyHistoryGoods = buyHistoryGoodsID.map((item, index) => {
            for (let i = 0; i < GoodsList.length; i++) {
                if(GoodsList[i].id == item.goodID) {
                    return GoodsList[i];
                }
            }
        });

        var buyHistoryElems = buyHistoryGoods.map((item, index) => {
            return (
                <tr>
                    <td><img src={item.photo} style={{width: "20%"}} /></td>
                    <td>{item.goodName}</td>
                    <td>{item.price}</td>
                </tr>
            );
        });

        return(
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Фото</th>
                            <th>Название</th>
                            <th>Цена</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buyHistoryElems}
                    </tbody>
                </table>
            </div>
        );
    }
}

class Main extends React.Component {
    render() {
        return(
            <div>
                <Carousel />
                <Goods />
            </div>
        );
    }
}

class CurrentUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: ''
        }
    }

    render() {
        return(
            <div className="user-status" onMouseOver={() => {
                this.setState({login: document.getElementById('currentUserLogin').innerText});
            }}>
                <Link to={`/user/${this.state.login}`}>
                    <p id="currentUserLogin">Вход не выполнен</p>
                </Link>
                <Link to='/'>
                <i className="fa fa-sign-out fa-lg" aria-hidden="true" onClick = {() => {
                    currentUser = {};
                    isAutorized = false;
                    this.state.login = '';
                    document.getElementById('currentUserLogin').innerText = 'Вход не выполнен';
                }}></i>
                </Link>
            </div>
        );
    }
}

class Accumulators extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0
        }
    }

    render() {
        var goodList;
        $.ajax({
            type: "post",
            url: '/Accumulators',
            success: function(data){
                goodList = data;
            },
            dataType: 'json',
            async: false
        });

        var pageCount = Math.floor(goodList.length / 4);
        var pages = [];
        for (let i = 0; i < pageCount; i++) {
            pages.push(
                <div className="page-numbers" key={i} onClick={()=>{
                        this.setState({currentPage: i});
                }}>{i+1}</div>
            );
        }

        var elemsArr = [];
        var ind = 0;
        for (let i = 0; i < pageCount; i++) {
            elemsArr.push([]);
            for (let j = 0; j < 4; j++) {
                if (goodList[ind] != undefined) {
                    elemsArr[i].push(goodList[ind]);
                } else {
                    break;
                }
                ind++;
            }
        }

        var elems = elemsArr[this.state.currentPage].map(function(item, index){
            return(
                <div className="container" key={index}>
                <Link to={`/goods/${item.id}`} key={index}>
                <img src={item.photo} className="img-responsive" style={{
                    margin: 'auto',
                    marginBottom: '20%'
                }} alt="Responsive image"/>
                <p className="good-name">{item.goodName}</p>
            <br/>
            <p className="good-price">{item.price}</p>
            </Link>
            <button type="button" className="btn btn-primary" onClick={function() {
                cartList.push(item);
                document.getElementById('goods-count').innerText = cartList.length;
            }}>Купить</button>
                </div>
            );
        });

        return(
            <div className="goods">
                {elems}
            </div>
        );
    }
}

class Atomizers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0
        }
    }

    render() {
        var goodList;
        $.ajax({
            type: "post",
            url: '/atomizers',
            success: function(data){
                goodList = data;
            },
            dataType: 'json',
            async: false
        });

        var pageCount = Math.floor(goodList.length / 4);
        var pages = [];
        for (let i = 0; i < pageCount; i++) {
            pages.push(
                <div className="page-numbers" key={i} onClick={()=>{
                        this.setState({currentPage: i});
                }}>{i+1}</div>
            );
        }

        var elemsArr = [];
        var ind = 0;
        for (let i = 0; i < pageCount; i++) {
            elemsArr.push([]);
            for (let j = 0; j < 4; j++) {
                if (goodList[ind] != undefined) {
                    elemsArr[i].push(goodList[ind]);
                } else {
                    break;
                }
                ind++;
            }
        }

        var elems = elemsArr[this.state.currentPage].map(function(item, index){
            return(
                <div className="container" key={index}>
                <Link to={`/goods/${item.id}`} key={index}>
                <img src={item.photo} className="img-responsive" style={{
                    margin: 'auto',
                    marginBottom: '20%'
                }} alt="Responsive image"/>
                <p className="good-name">{item.goodName}</p>
            <br/>
            <p className="good-price">{item.price}</p>
            </Link>
            <button type="button" className="btn btn-primary" onClick={function() {
                cartList.push(item);
                document.getElementById('goods-count').innerText = cartList.length;
            }}>Купить</button>

            </div>
            );
        });

        return(
            <div className="goods">
                {elems}
            </div>
        );
    }
}

class Chargers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0
        }
    }

    render() {
        var goodList;
        $.ajax({
            type: "post",
            url: '/Chargers',
            success: function(data){
                goodList = data;
            },
            dataType: 'json',
            async: false
        });

        var pageCount = Math.floor(goodList.length / 4);
        var pages = [];
        for (let i = 0; i < pageCount; i++) {
            pages.push(
                <div className="page-numbers" key={i} onClick={()=>{
                        this.setState({currentPage: i});
                }}>{i+1}</div>
            );
        }

        var elemsArr = [];
        var ind = 0;
        for (let i = 0; i < pageCount; i++) {
            elemsArr.push([]);
            for (let j = 0; j < 4; j++) {
                if (goodList[ind] != undefined) {
                    elemsArr[i].push(goodList[ind]);
                } else {
                    break;
                }
                ind++;
            }
        }

        var elems = elemsArr[this.state.currentPage].map(function(item, index){
            return(
                <div className="container" key={index}>
                <Link to={`/goods/${item.id}`} key={index} >
                <img src={item.photo} className="img-responsive" style={{
                    margin: 'auto',
                    marginBottom: '20%'
                }} alt="Responsive image"/>
                <p className="good-name">{item.goodName}</p>
            <br/>
            <p className="good-price">{item.price}</p>
            </Link>
            <button type="button" className="btn btn-primary" onClick={function() {
                cartList.push(item);
                document.getElementById('goods-count').innerText = cartList.length;
            }}>Купить</button>
                </div>
            );
        });

        return(
            <div className="goods">
                {elems}
            </div>
        );
    }
}

class Coils extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0
        }
    }

    render() {
        var goodList;
        $.ajax({
            type: "post",
            url: '/Coils',
            success: function(data){
                goodList = data;
            },
            dataType: 'json',
            async: false
        });

        var pageCount = Math.floor(goodList.length / 4);
        var pages = [];
        for (let i = 0; i < pageCount; i++) {
            pages.push(
                <div className="page-numbers" key={i} onClick={()=>{
                        this.setState({currentPage: i});
                }}>{i+1}</div>
            );
        }

        var elemsArr = [];
        var ind = 0;
        for (let i = 0; i < pageCount; i++) {
            elemsArr.push([]);
            for (let j = 0; j < 4; j++) {
                if (goodList[ind] != undefined) {
                    elemsArr[i].push(goodList[ind]);
                } else {
                    break;
                }
                ind++;
            }
        }

        var elems = elemsArr[this.state.currentPage].map(function(item, index){
            return(
                <div className="container" key={index}>
                <Link to={`/goods/${item.id}`} key={index}>
                <img src={item.photo} className="img-responsive" style={{
                    margin: 'auto',
                    marginBottom: '20%'
                }} alt="Responsive image"/>
                <p className="good-name">{item.goodName}</p>
            <br/>
            <p className="good-price">{item.price}</p>
            </Link>
            <button type="button" className="btn btn-primary" onClick={function() {
                cartList.push(item);
                document.getElementById('goods-count').innerText = cartList.length;
            }}>Купить</button>
                </div>
            );
        });

        return(
            <div className="goods">
                {elems}
            </div>
        );
    }
}

class Liquids extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0
        }
    }

    render() {
        var goodList;
        $.ajax({
            type: "post",
            url: '/Liquids',
            success: function(data){
                goodList = data;
            },
            dataType: 'json',
            async: false
        });

        var pageCount = Math.floor(goodList.length / 4);
        var pages = [];
        for (let i = 0; i < pageCount; i++) {
            pages.push(
                <div className="page-numbers" key={i} onClick={()=>{
                        this.setState({currentPage: i});
                }}>{i+1}</div>
            );
        }

        var elemsArr = [];
        var ind = 0;
        for (let i = 0; i < pageCount; i++) {
            elemsArr.push([]);
            for (let j = 0; j < 4; j++) {
                if (goodList[ind] != undefined) {
                    elemsArr[i].push(goodList[ind]);
                } else {
                    break;
                }
                ind++;
            }
        }

        var elems = elemsArr[this.state.currentPage].map(function(item, index){
            return(
                <div className="container" key={index}>
                <Link to={`/goods/${item.id}`} key={index}>
                <img src={item.photo} className="img-responsive" style={{
                    margin: 'auto',
                    marginBottom: '20%'
                }} alt="Responsive image"/>
                <p className="good-name">{item.goodName}</p>
            <br/>
            <p className="good-price">{item.price}</p>
            </Link>
            <button type="button" className="btn btn-primary" onClick={function() {
                cartList.push(item);
                document.getElementById('goods-count').innerText = cartList.length;
            }}>Купить</button>
                </div>
            );
        });

        return(
            <div className="goods">
                {elems}
            </div>
        );
    }
}

class Mods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0
        }
    }

    render() {
        var goodList;
        $.ajax({
            type: "post",
            url: '/Mods',
            success: function(data){
                goodList = data;
            },
            dataType: 'json',
            async: false
        });

        var pageCount = Math.floor(goodList.length / 4);
        var pages = [];
        for (let i = 0; i < pageCount; i++) {
            pages.push(
                <div className="page-numbers" key={i} onClick={()=>{
                        this.setState({currentPage: i});
                }}>{i+1}</div>
            );
        }

        var elemsArr = [];
        var ind = 0;
        for (let i = 0; i < pageCount; i++) {
            elemsArr.push([]);
            for (let j = 0; j < 4; j++) {
                if (goodList[ind] != undefined) {
                    elemsArr[i].push(goodList[ind]);
                } else {
                    break;
                }
                ind++;
            }
        }

        var elems = elemsArr[this.state.currentPage].map(function(item, index){
            return(
                <div className="container" key={index}>
                <Link to={`/goods/${item.id}`} key={index}>
                <img src={item.photo} className="img-responsive" style={{
                    margin: 'auto',
                    marginBottom: '20%'
                }} alt="Responsive image"/>
                <p className="good-name">{item.goodName}</p>
            <br/>
            <p className="good-price">{item.price}</p>
            </Link>
            <button type="button" className="btn btn-primary" onClick={function() {
                cartList.push(item);
                document.getElementById('goods-count').innerText = cartList.length;
            }}>Купить</button>
                </div>
            );
        });

        return(
            <div className="goods">
                {elems}
            </div>
        );
    }
}

class Header extends React.Component {
    render() {
        return(
            <header className="jumbotron" style={{backgroundColor:'rgb(9, 9, 14)'}}>
                <ul className="nav nav-pills">
                    <li role="presentation" className="active"><Link to="/">Главная</Link></li>
                    <li role="presentation"><a onClick={() => {
                        $('.autorize-form').css('display', 'block');
                    }}>Авторизация</a></li>
                    <div className="autorize-form" onClick={() => {
                        $('.autorize-form').css('display', 'block');
                        // $('.login').css('display', 'none');
                    }}>
                        <input type="text" placeholder="Логин" id="login" />
                        <input type="password" placeholder="Пароль" id="pass" />
                        <div className="alert alert-danger alert-dismissable fade in login">
                            <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                            Введен неверный логин или пароль.
                        </div>
                        <input type="button" value="Войти" onClick={() => {
                            var users;
                            var login = document.getElementById('login').value;
                            var pass = document.getElementById('pass').value;
                            $.ajax({
                                type: "post",
                                url: '/login',
                                success: function(res){
                                    users = res;
                                },
                                dataType: 'json',
                                async: false
                            });
                            if (!isAutorized) {
                                for (let i = 0; i < users.length; i++) {
                                    if (users[i].login == login && users[i].pass == pass) {
                                        isAutorized = true;
                                        currentUser = {
                                            login: login,
                                            pass: pass
                                        };
                                    }
                                }
                            }
                            if (!isAutorized) {
                                $('.login').css('display', 'block');
                                return;
                            }
                            $('.autorize-form').css('display', 'none');
                            document.getElementById('currentUserLogin').innerText = currentUser.login;
                        }} />
                    </div>
                    <li><Link to="/registration">Регистрация</Link></li>
                    <li role="presentation"><a>Контакты</a></li>
                    <li id="search-field"><Search /></li>
                </ul>

                <div className="cart" id="cart">
                    <CurrentUser />
                    <CartIcon />
                </div>
            </header>
        );
    }
}

class Registration extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="reg-form">
                <h1>Регистрация</h1>
                <h2>Логин</h2>
                <input id="regLogin" />
                <h2>Пароль</h2>
                <input type="password" id="regPass" />
                <h2>Подтверждение пароля</h2>
                <input type="password" id="regPassConfirm" />
                <h2>Email</h2>
                <input id="regEmail" />
                <div className="alert alert-danger alert-dismissable fade in register">
                    <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                    Пароли не совпадают!
                </div>
                <div className="alert alert-danger alert-dismissable fade in register-log-em">
                    <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                    Имя пользователя или Email уже используются!
                </div>
                <div className="alert alert-success alert-dismissable fade in register-reg-suc">
                    <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                    Регистрация прошла успешно!
                </div>
                <input type="button" value="Зарегистрироваться" onClick={() => {
                    var passMain = document.getElementById('regPass').value;
                    var passConf = document.getElementById('regPassConfirm').value;
                    if (passConf != passMain) {
                        $('.register').css('display', 'block');
                        return;
                    }
                    var userData = {
                        login: document.getElementById('regLogin').value,
                        password: document.getElementById('regPass').value,
                        regEmail: document.getElementById('regEmail').value
                    };
                    var isRegPossible;
                    $.ajax({
                        type: "post",
                        url: '/registration',
                        data: userData,
                        success: function(res) {
                            isRegPossible = res;
                        },
                        dataType: 'json',
                        async: false
                    });
                    console.log(isRegPossible);
                    if (isRegPossible.isEmailMatch != true) {
                        $('.register-log-em').css('display', 'block');
                        return;
                    }
                    if (isRegPossible.isLoginMatch != true) {
                        $('.register-log-em').css('display', 'block');
                        return;
                    }
                    $('.register-reg-suc').css('display', 'block');
                    isAutorized = true;
                    currentUser = {
                        login: document.getElementById('regLogin').value,
                        pass: document.getElementById('regPass').value
                    };
                    document.getElementById('currentUserLogin').innerText = currentUser.login;
                }}/>
            </div>
        );
    }
}

class Profile extends React.Component {
    render() {
        if (isAutorized) {
            return(
                <div>
                    <h1>{currentUser.login}</h1>
                    <UsersHistory />
                </div>
            );
        } else {
            return(
                <h1>Вы не авторизованы</h1>
            );
        }
    }
}

class Good extends React.Component {
    render() {
        var id = this.props.match.params.id;
        var good = GoodsList.find(function(item, index) {
            if(id == item.id) {
                return true;
            }
            return false;
        });
        $('.search-results').css('display', 'none');
        return(
            <div goodId={good.id}>
            <h1>{good.goodName}</h1>
            <img src={good.photo} className="img-responsive" style={{
                display: 'inline'
            }} alt="Responsive image" />
            <h2 style={{color: 'rgb(0, 0, 0)'}}>Описание</h2>
            <p style={{
                display: 'inline'
            }}>{good.description}</p>
            <p className="good-price-description">{good.price}</p>
            <button type="button" className="btn btn-primary" onClick={function() {
                    cartList.push(good);
                    document.getElementById('goods-count').innerText = cartList.length;
                    }}>Купить</button>
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return(
            <BrowserRouter>
                <div>
                    <Header />

                    <Navbar>
                        <NavItem path="/batteries" categoryName="Аккумуляторы" />
                        <NavItem path="/mods" categoryName="Моды" />
                        <NavItem path="/liquid" categoryName="Жидкости" />
                        <NavItem path="/chargers" categoryName="Зарядные устройства" />
                        <NavItem path="/coils" categoryName="Проволка" />
                        <NavItem path="/atomizers" categoryName="Атомайзеры" />
                    </Navbar>
                    <MainLayout>
                    <Switch>
                        <Route exact path="/" component={Main} />
                        <Route exact path="/cart" component={Cart} />
                        <Route exact path="/goods/:id" component={Good}/>
                        <Route exact path="/atomizers" component={Atomizers} />
                        <Route exact path="/batteries" component={Accumulators} />
                        <Route exact path="/chargers" component={Chargers} />
                        <Route exact path="/coils" component={Coils} />
                        <Route exact path="/liquid" component={Liquids} />
                        <Route exact path="/mods" component={Mods} />
                        <Route exact path="/registration" component={Registration}/>
                        <Route exact path="/user/:login" component={Profile}/>
                    </Switch>
                    </MainLayout>
                </div>
            </BrowserRouter>
        );
    }
}

var loadPage = function() {

    ReactDOM.render(
        <App />, document.getElementById('main'));
}

var hideElems = function() {
    $('.autorize-form').css('display', 'none');
    $('.search-results').css('display', 'none');
}

body.addEventListener('load', loadPage());
body.addEventListener('click', hideElems);
