const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.status(200);

  res.render('home', {
    title: 'Главная',
    isHome: true
  });
});

module.exports = router;
