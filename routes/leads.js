const { Router } = require('express');
const Lead = require('../models/lead');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, async (req, res) => {
  res.status(200);

  const leads = await Lead.find().lean();

  res.render('leads', {
    title: 'Заявки',
    isLeads: true,
    leads
  });
});

router.post('/add', async (req, res) => {
  const { firstName, lastName, tel, email, description } = req.body;

  const lead = new Lead({
    firstName,
    lastName,
    tel,
    email,
    description
  });

  try {
    await lead.save();

    res.redirect('/');
  } catch (e) {
    console.error(e);
  }
});

router.post('/submit', auth, async (req, res) => {
  try {
    const { id } = req.body;

    const lead = await Lead.findByIdAndUpdate(id, { status: 'in_progress' });
  
    lead.save();
  
    res.status(200).json({ id });
  } catch (e) {
    console.error(e); 
  }
});

router.post('/done', auth, async (req, res) => {
  try {
    const { id } = req.body;

    const lead = await Lead.findByIdAndUpdate(id, { status: 'done' });
  
    lead.save();
  
    res.status(200).json({ id });
  } catch (e) {
    console.error(e); 
  }
});

router.delete('/remove/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    
    await Lead.findByIdAndRemove(id)
  
    res.status(200).json({ id });
  } catch (e) {
    console.error(e)
  }
})

module.exports = router;
