document.addEventListener('DOMContentLoaded', function() {
    // Live Chat Toggle
    const chatToggle = document.querySelector('.chat-toggle');
    const chatWindow = document.querySelector('.chat-window');
    
    chatToggle.addEventListener('click', function() {
      chatWindow.classList.toggle('active');
    });
    
    document.querySelector('.close-chat').addEventListener('click', function() {
      chatWindow.classList.remove('active');
    });
    
    // Emergency Alert Toggle
    const emergencyBtn = document.querySelector('.emergency-btn');
    const emergencyModal = document.querySelector('.emergency-modal');
    
    emergencyBtn.addEventListener('click', function() {
      emergencyModal.classList.toggle('active');
    });
    
    document.querySelector('.cancel-emergency').addEventListener('click', function() {
      emergencyModal.classList.remove('active');
    });
    
    // Appointment Modal
    const appointmentBtns = document.querySelectorAll('.book-btn, .hero-actions .primary-btn');
    const appointmentModal = document.querySelector('.appointment-modal');
    const closeModal = document.querySelector('.close-modal');
    
    appointmentBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        appointmentModal.classList.add('active');
      });
    });
    
    closeModal.addEventListener('click', function() {
      appointmentModal.classList.remove('active');
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target === appointmentModal) {
        appointmentModal.classList.remove('active');
      }
      if (e.target === emergencyModal) {
        emergencyModal.classList.remove('active');
      }
    });
    
    // Department and Doctor Selection Logic
    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    
    const doctorsByDepartment = {
      cardiology: ['Dr. John Smith', 'Dr. Sarah Johnson'],
      neurology: ['Dr. Michael Brown', 'Dr. Emily Davis'],
      orthopedics: ['Dr. Robert Wilson', 'Dr. Jennifer Lee'],
      pediatrics: ['Dr. David Miller', 'Dr. Lisa Chen']
    };
    
    departmentSelect.addEventListener('change', function() {
      const selectedDept = this.value;
      doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
      
      if (selectedDept) {
        doctorsByDepartment[selectedDept].forEach(doctor => {
          const option = document.createElement('option');
          option.value = doctor.replace('Dr. ', '').toLowerCase().replace(' ', '-');
          option.textContent = doctor;
          doctorSelect.appendChild(option);
        });
      }
    });
    
    // Time Slot Generation
    const timeSelect = document.getElementById('time');
    
    doctorSelect.addEventListener('change', function() {
      timeSelect.innerHTML = '<option value="">Select Time Slot</option>';
      
      if (this.value) {
        // Generate time slots (every 30 minutes from 9AM to 4PM)
        const startHour = 9;
        const endHour = 16;
        
        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const option = document.createElement('option');
            option.value = timeString;
            option.textContent = timeString;
            timeSelect.appendChild(option);
          }
        }
      }
    });
    
    // Form Submission
    const appointmentForm = document.getElementById('appointment-form');
    
    appointmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const department = departmentSelect.value;
      const doctor = doctorSelect.options[doctorSelect.selectedIndex].text;
      const date = document.getElementById('date').value;
      const time = timeSelect.value;
      const reason = document.getElementById('reason').value;
      
      // Here you would typically send this data to a server
      console.log('Appointment Booked:', {
        department,
        doctor,
        date,
        time,
        reason
      });
      
      // Show confirmation
      alert(`Appointment booked with ${doctor} on ${date} at ${time}`);
      
      // Reset form and close modal
      this.reset();
      appointmentModal.classList.remove('active');
    });
    
    // Emergency Actions
    document.querySelector('.call-911').addEventListener('click', function() {
      alert('Calling emergency services...');
      emergencyModal.classList.remove('active');
    });
    
    document.querySelector('.notify-hospital').addEventListener('click', function() {
      const emergencyDesc = document.querySelector('.emergency-modal textarea').value;
      alert(`Hospital notified with emergency: ${emergencyDesc}`);
      emergencyModal.classList.remove('active');
    });
    
    // Chat Functionality (simplified)
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input input');
    const chatSendBtn = document.querySelector('.chat-input button');
    
    // Predefined responses
    const botResponses = [
      "How can I assist you today?",
      "Our customer service hours are from 8AM to 8PM.",
      "For medical emergencies, please call 911 immediately.",
      "You can book appointments through our online portal.",
      "Our pharmacy is open from 9AM to 6PM daily."
    ];
    
    chatSendBtn.addEventListener('click', function() {
      const message = chatInput.value.trim();
      if (message) {
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate bot response after a delay
        setTimeout(() => {
          const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
          addMessage(randomResponse, 'bot');
        }, 1000);
      }
    });
    
    function addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', sender);
      messageDiv.textContent = text;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Initialize with a welcome message
    setTimeout(() => {
      addMessage("Hello! Welcome to MediCare Hospital. How can I help you today?", 'bot');
    }, 500);
    
    // Doctor Slider Navigation
    const doctorSlider = document.querySelector('.doctor-slider');
    let isDown = false;
    let startX;
    let scrollLeft;
    
    doctorSlider.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - doctorSlider.offsetLeft;
      scrollLeft = doctorSlider.scrollLeft;
    });
    
    doctorSlider.addEventListener('mouseleave', () => {
      isDown = false;
    });
    
    doctorSlider.addEventListener('mouseup', () => {
      isDown = false;
    });
    
    doctorSlider.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - doctorSlider.offsetLeft;
      const walk = (x - startX) * 2;
      doctorSlider.scrollLeft = scrollLeft - walk;
    });
    
    // Set minimum date for appointment to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
  });