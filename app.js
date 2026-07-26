const form = document.getElementById('bookingForm');
const appointmentType = document.getElementById('appointmentType');
const addressWrap = document.getElementById('addressWrap');
const address = document.getElementById('address');
const dateInput = document.getElementById('date');

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().split('T')[0];

appointmentType.addEventListener('change', () => {
  const homeService = appointmentType.value.startsWith('Home service');
  addressWrap.classList.toggle('hidden', !homeService);
  address.required = homeService;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const values = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    service: document.getElementById('service').value,
    appointmentType: appointmentType.value,
    address: address.value.trim(),
    date: dateInput.value,
    time: document.getElementById('time').value,
    notes: document.getElementById('notes').value.trim()
  };

  const message = [
    'Hello Vibes & Trimz, I would like to request an appointment.',
    '',
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    `Service: ${values.service}`,
    `Appointment type: ${values.appointmentType}`,
    values.address ? `Address: ${values.address}` : '',
    `Preferred date: ${values.date}`,
    `Preferred time: ${values.time}`,
    values.notes ? `Notes: ${values.notes}` : '',
    '',
    'I understand that my appointment is confirmed only after you reply.'
  ].filter(Boolean).join('\n');

  const whatsappNumber = '447586735046';
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});
