const express = require('express');

require('dotenv').config();

const db = require("./config/database.js");

// import models
const { Feedback } = require('./models/feedback');
const { Plan } = require('./models/Plans');
const { User } = require('./models/users');

const app = express();

const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(express.static('public'));
app.set("view engine", "ejs");

const { Op } = require('sequelize');  

///////////////////////Routs/////////////////////////////

//create basic plans & save them into the dataset
app.get('/seed', async (req, res) => {
  try {
    await Plan.bulkCreate([
      {
        name: 'الخطة الأساسية',
        price: 10,
        billing_type: 'monthly',
        is_featured: false,
        features: [
          'تحليل أساسي للعرض التقديمي',
          'تقرير حول الأخطاء اللغوية ووضوح الصوت',
          'دعم فني عبر البريد الإلكتروني',
          '5 جلسات تدريبية شهريًا'
        ]
      },
      {
        name: 'الخطة المحترفة',
        price: 30,
        billing_type: 'monthly',
        is_featured: true,
        features: [
          'تحليل متقدم باستخدام الذكاء الاصطناعي',
          'تحليل لغة الجسد والتواصل البصري',
          'دعم فني عبر الدردشة',
          '20 جلسة تدريبية شهريًا',
          'تحسين تلقائي لمهارات العرض'
        ]
      },
      {
        name: 'الخطة المتقدمة',
        price: 50,
        billing_type: 'monthly',
        is_featured: false,
        features: [
          'تحليل شامل يتضمن الصوت، النبرة، التفاعل، والمحتوى',
          'مدرب افتراضي للعرض التقديمي',
          'دعم فني مخصص',
          'جلسات تدريبية غير محدودة',
          'تقارير أداء تفصيلية مع تحسينات تلقائية'
        ]
      }
    ], { ignoreDuplicates: true });

    res.send('Plans inserted into the database!');
  } catch (err) {
    console.error('Failed to seed plans:', err);
    res.status(500).send('Seeding failed');
  }
});


//homepage , display plans from db
app.get('/', async (req, res) => {
  try {
    const plans = await Plan.findAll();
    res.render('index', { plans });
  } catch (err) {
    console.error('Error loading plans:', err);
    res.render('index', { plans: [] });
  }
});


//login page
app.get('/login', (req, res) => {
  res.render('login'); 
});

//acc page
app.get('/acc', (req, res) => {
  res.render('acc');  
});



//save new users to users table, from the registartion form
app.post('/register', async (req, res) => {
  const { newUsername, newEmail, newPassword } = req.body;

  try {
    await User.create({
      name: newUsername,
      email: newEmail,
      password: newPassword,
      role: 'user' // or 'admin' if manually
    });

    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Registration failed');
  }
});

// save feedback from footer-form in main into the feedback table:
app.post('/feedback', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await Feedback.create({ name, email, subject, message });
    res.redirect('/'); //if successfuly sent, redirect to home
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).send('لم نتمكن من إرسال الملاحظة.');
  }
});


//control the feedback in the admin page : display or search
//create roles, if admin acc > get feedbacks & search for feedbacks & add remove plans
const session = require('express-session');

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, password } });

  if (!user) return res.status(401).send('Invalid credentials');

  req.session.user = {
    id: user.id,
    name: user.name,
    role: user.role
  };

  if (user.role === 'admin') {
    res.redirect('/admin');
  } else {
    res.redirect('/acc');
  }
});

//manually create the admin account:
app.get('/create-admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (existingAdmin) return res.send('Admin already exists.');

    await User.create({
      name: 'Admin User',
      email: 'admin@admin.com',
      password: 'admin',  
      role: 'admin'
    });

    res.send('Admin created: admin@admin.com / admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create admin');
  }
});



//admin page , Get feedbacks
app.get('/admin', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll();
    res.render('admin', { feedbacks, error: null, query: '' }); 
  } catch (err) {
    res.render('admin', { feedbacks: [], error: 'ًError in feedback', query: '' });
  }
});


//search for a feedback by key
app.get('/admin/feedback/search', async (req, res) => {
  const query = req.query.query || '';

  try {
    const results = await Feedback.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          { subject: { [Op.like]: `%${query}%` } },
          { message: { [Op.like]: `%${query}%` } }
        ]
      }
    });

    res.render('admin', {
      feedbacks: results,
      error: null,
      query
    });
  } catch (err) {
    console.error('Search error:', err.message); 
    res.render('admin', {
      feedbacks: [],
      error: 'حدث خطأ في البحث',
      query
    });
  }
});




//admin can see, delete, add plans to Plans table in DB
//display plans
app.get('/admin/plans', async (req, res) => {
  try {
    const plans = await Plan.findAll();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching plans' });
  }
});

//add plan
app.post('/admin/plans', async (req, res) => {
  try {
    const { name, price, billing_type, is_featured, features } = req.body;
    const newPlan = await Plan.create({
      name,
      price,
      billing_type,
      is_featured,
      features
    });
    res.status(201).json(newPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add plan' });
  }
});

// delete plan
app.delete('/admin/plans', async (req, res) => {
  try {
    const { ids } = req.body; 
    await Plan.destroy({ where: { id: ids } });
    res.status(200).json({ message: 'Plans deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plans' });
  }
});




// Start server, then connect to database
app.listen(process.env.PORT, async () => {
  await db.connectToDB();
  console.log(`Server is listening at http://localhost:${process.env.PORT}`);
});