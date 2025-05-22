const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/personalDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  email: String,
  phone: String,
  address: String
});
const Person = mongoose.model('Person', personSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const generateHTML = (people, message = '', editData = null) => {
  return `<!DOCTYPE html>
  <html>
  <head>
  <title>Personal Info</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      form { margin-bottom: 20px; background: #f5f5f5; padding: 20px; border-radius: 5px; }
      input, textarea { display: block; margin: 10px 0; padding: 8px; width: 300px; }
      table { border-collapse: collapse; width: 100%; margin-top: 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      button { padding: 5px 10px; cursor: pointer; margin-right: 5px; }
      .alert {
        padding: 10px;
        margin-bottom: 20px;
        border-radius: 4px;
        display: ${message ? 'block' : 'none'};
      }
      .success { background-color: #dff0d8; color: #3c763d; }
      .error { background-color: #f2dede; color: #a94442; }
      .edit-form { background-color: #e7f3fe; padding: 15px; margin-bottom: 20px; }
    </style>
    <script>
      function showEditForm(id) {
        document.getElementById('edit-form-' + id).style.display = 'block';
      }
      setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) alert.style.display = 'none';
      }, 3000);
    </script>
  </head>
  <body>
    <h1>Personal Information</h1>
    
    ${message ? `<div class="alert ${message.type}">${message.text}</div>` : ''}
    
    <form action="${editData ? '/update/' + editData._id : '/add'}" method="POST">
      <h2>${editData ? 'Edit Person' : 'Add New Person'}</h2>
      <input type="text" name="name" placeholder="Name" value="${editData ? editData.name : ''}" required>
      <input type="number" name="age" placeholder="Age" value="${editData ? editData.age : ''}">
      <input type="email" name="email" placeholder="Email" value="${editData ? editData.email : ''}">
      <input type="text" name="phone" placeholder="Phone" value="${editData ? editData.phone : ''}">
      <textarea name="address" placeholder="Address">${editData ? editData.address : ''}</textarea>
      <button type="submit">${editData ? 'Update' : 'Add'} Person</button>
      ${editData ? '<a href="/" class="button">Cancel</a>' : ''}
    </form>
    
    <h2>Records</h2>
    <table>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Address</th>
        <th>Actions</th>
      </tr>
      ${people.map(person => `
        <tr>
          <td>${person.name}</td>
          <td>${person.age || ''}</td>
          <td>${person.email || ''}</td>
          <td>${person.phone || ''}</td>
          <td>${person.address || ''}</td>
          <td>
            <a href="/edit/${person._id}" class="button">Edit</a>
            <form action="/delete/${person._id}" method="POST" style="display:inline;">
              <button type="submit" onclick="return confirm('Are you sure?')">Delete</button>
            </form>
          </td>
        </tr>
      `).join('')}
    </table>
  </body>
  </html>`;
};

app.get('/', async (req, res) => {
    try {
      const people = await Person.find();
      res.send(generateHTML(people, req.query.message ? {
        text: req.query.message,
        type: req.query.type || 'success'
      } : null));
    } catch (err) {
      res.status(500).send(generateHTML([], {
        text: 'Error loading data',
        type: 'error'
      }));
    }
  });
  
  
  app.post('/add', async (req, res) => {
    try {
      const newPerson = new Person(req.body);
      await newPerson.save();
      res.redirect('/?message=Person added successfully&type=success');
    } catch (err) {
      res.redirect('/?message=Error saving data&type=error');
    }
  });

  app.get('/edit/:id', async (req, res) => {
    try {
      const person = await Person.findById(req.params.id);
      const people = await Person.find();
      res.send(generateHTML(people, null, person));
    } catch (err) {
      res.redirect('/?message=Error loading edit form&type=error');
    }
  });
  
  app.post('/update/:id', async (req, res) => {
    try {
      await Person.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/?message=Person updated successfully&type=success');
    } catch (err) {
      res.redirect('/?message=Error updating data&type=error');
    }
  });
  
  app.post('/delete/:id', async (req, res) => {
    try {
      await Person.findByIdAndDelete(req.params.id);
      res.redirect('/?message=Person deleted successfully&type=success');
    } catch (err) {
      res.redirect('/?message=Error deleting data&type=error');
    }
  });
  

  const PORT = 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));