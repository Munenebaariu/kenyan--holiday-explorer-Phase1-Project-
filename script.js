
const holidayList = document.getElementById('holiday-list');
const monthSelect = document.getElementById('month-select');
const themeToggle = document.getElementById('theme-toggle');


let allHolidays = [];

const sampleHolidays = [
  { date: "2025-01-01", localName: "New Year's Day", name: "New Year's Day" },
  { date: "2025-03-10", localName: "Independence Day (example)", name: "Independence Day" },
  { date: "2025-12-25", localName: "Christmas Day", name: "Christmas Day" }
];

function setStatus(msgHtml) {
  holidayList.innerHTML = `<p>${msgHtml}</p>`;
}


setStatus('Loading holidays...');

function fetchHolidays() {
  const url = 'https://date.nager.at/api/v3/PublicHolidays/2025/KE';
  console.log('Fetching holidays from:', url);

  fetch(url)
    .then(resp => {
      console.log('Fetch response status:', resp.status);
      if (!resp.ok) throw new Error('Network response was not OK: ' + resp.status);
      return resp.json();
    })
    .then(data => {
      console.log('Fetched holidays count:', data.length);
      allHolidays = data;
      renderHolidays(allHolidays);
    })
    .catch(err => {
      
      console.error('Fetch failed:', err);
      setStatus('Failed to load holidays from the network. Using sample data below.');
      
      allHolidays = sampleHolidays;
      renderHolidays(allHolidays);
    });
}


function renderHolidays(list) {
  holidayList.innerHTML = '';
  if (!list || list.length === 0) {
    holidayList.innerHTML = '<p>No holidays found.</p>';
    return;
  }

  list.forEach(h => {
    const d = new Date(h.date);
    const monthName = d.toLocaleString('default', { month: 'long' });
    const container = document.createElement('div');
    container.className = 'holiday';
    container.innerHTML = `
      <div><strong>${h.localName}</strong> <small>(${h.name})</small></div>
      <div><span class="date">${h.date}</span> — <em>${monthName}</em></div>
    `;
    holidayList.appendChild(container);
  });
}


monthSelect.addEventListener('change', (e) => {
  const val = e.target.value;
  if (val === 'all') {
    renderHolidays(allHolidays);
  } else {
    const m = Number(val); // 1..12
    const filtered = allHolidays.filter(h => {
      const month = new Date(h.date).getMonth() + 1;
      return month === m;
    });
    renderHolidays(filtered);
  }
});


themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});


fetchHolidays();
