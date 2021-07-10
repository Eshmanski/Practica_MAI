const { Router } = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const router = Router();

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Аторизация',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        if (candidate.isActivated) {
          req.session.user = candidate;
          req.session.isAuthenticated = true;

          req.session.save((err) => {
            if (err) {
              throw err;
            }
        
            res.redirect('/');
          });
        } else {
          req.flash('loginError', 'Аккаунт не подтвержден админом');
          res.redirect('/auth/login#login');
        }
      } else {
        req.flash('loginError', 'Неправильный логин или пароль');
        res.redirect('/auth/login#login');
      }
    } else {
      req.flash('loginError', 'Неправильный логин или пароль');
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.warn(e);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, repeat, name } = req.body;

    if (password === repeat) {
      const candidate = await User.findOne({ email });

      if (candidate) {
        req.flash('registerError', 'Пользователь с таким email уже существует');
        res.redirect('/auth/login#register')
      } else {
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
          email, name, password: hashPassword, cart: {items: []}
        });

        await user.save();

        res.redirect('/auth/login#login');
      }
    } else {
      req.flash('registerError', 'Пользователь с таким email уже существует');
      res.redirect('/auth/login#register');
    }
  } catch(e) {
    console.warn(e);
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});

module.exports = router;
