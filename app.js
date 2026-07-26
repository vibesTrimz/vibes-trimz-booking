const form = document.getElementById('bookingForm');
const appointmentType = document.getElementById('appointmentType');
const addressWrap = document.getElementById('addressWrap');
const address = document.getElementById('address');
const dateSelect = document.getElementById('date');
const timeSelect = document.getElementById('time');

let availability = {};

appointmentType.addEventListener('change', () => {
  const homeService = appointmentType.value.startsWith('Home service');
  addressWrap.classList.toggle('hidden', !homeService);
  address.required = homeService;
});

async function loadAvailability() {
  try {
    const response = await fetch('availability.json', { cache: 'no-store' });

    if (!response.ok) {
      throw new Error('Could not load availability');
    }

    availability = await response.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = Object.keys(availability)
      .filter(date => new Date(date + 'T00:00:00') >= today)
      .filter(date => Array.isArray(availability[date]) && availability[date].length > 0)
      .sort();

    dateSelect.innerHTML = '<option value="">Choose a date</option>';

    dates.forEach(date => {
      const displayDate = new Date(date + 'T12:00:00').toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const option = document.createElement('option');
      option.value = date;
      option.textContent = displayDate;
      dateSelect.appendChild(option);
    });

    if (dates.length === 0) {
      dateSelect.innerHTML = '<option value="">No appointments currently available</option>';
      dateSelect.disabled = true;
    }
  } catch (error) {
    dateSelect.innerHTML = '<option value="">Unable to load available dates</option>';
    dateSelect.disabled = true;
    console.error(error);
  }
}

dateSelect.addEventListener('change', () => {
  const selectedDate = dateSelect.value;
  const times = availability[selectedDate] || [];

  timeSelect.innerHTML = '<option value="">Choose a time</option>';

  times.forEach(time => {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = time;
    timeSelect.appendChild(option);
  });

  timeSelect.disabled = times.length === 0;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const selectedDateText =
    dateSelect.options[dateSelect.selectedIndex]?.textContent || dateSelect.value;

  const values = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    service: document.getElementById('service').value,
    appointmentType: appointmentType.value,
    address: address.value.trim(),
    date: selectedDateText,
    time: timeSelect.value,
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

loadAvailability();
