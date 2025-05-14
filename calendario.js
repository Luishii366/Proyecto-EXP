const monthSelector = document.getElementById("monthSelector");
const calendar = document.getElementById("calendar");

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Recordatorios almacenados en localStorage
let reminders = JSON.parse(localStorage.getItem("reminders")) || {};

function createMonthOptions() {
  const currentMonth = new Date().getMonth();
  months.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = month;
    if (index === currentMonth) option.selected = true;
    monthSelector.appendChild(option);
  });
}

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function createCalendar(month) {
  const year = new Date().getFullYear();
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = new Date(year, month, 1).getDay(); 
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
  const currentDay = today.getDate();

  calendar.innerHTML = "";

  // Nombres de días
  for (let i = 0; i < 7; i++) {
    const dayName = document.createElement("div");
    dayName.className = "day-name";
    dayName.textContent = weekDays[i];
    calendar.appendChild(dayName);
  }

  // Espacios vacíos antes del primer día
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < offset; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "empty";
    calendar.appendChild(emptyCell);
  }

  // Días del mes
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.className = "day";
    day.textContent = i;

    if (isCurrentMonth && i === currentDay) {
      day.classList.add("today");
    }

    const dateKey = `${year}-${month + 1}-${i}`;
    if (reminders[dateKey]) {
      const dot = document.createElement("span");
      dot.className = "reminder-dot";
      day.appendChild(dot);
    }

    day.onclick = () => openReminderModal(i, month, year);
    calendar.appendChild(day);
  }
}

function openReminderModal(day, month, year) {
  const dateKey = `${year}-${month + 1}-${day}`;
  const reminderText = reminders[dateKey] || '';

  document.getElementById('selectedDayDisplay').textContent = `Recordatorio para el ${day}/${month + 1}/${year}`;
  document.getElementById('reminderText').value = reminderText;
  document.getElementById('reminderText').setAttribute('data-date', dateKey);
  document.getElementById('reminderModal').style.display = 'block';
}

function saveReminder() {
  const dateKey = document.getElementById('reminderText').getAttribute('data-date');
  const text = document.getElementById('reminderText').value.trim();

  if (text) {
    reminders[dateKey] = text;
  } else {
    delete reminders[dateKey];
  }

  localStorage.setItem('reminders', JSON.stringify(reminders));
  closeReminderModal();
  createCalendar(parseInt(monthSelector.value));
}

function closeReminderModal() {
  document.getElementById('reminderModal').style.display = 'none';
}

function closeModal() {
  document.getElementById("overlay").style.display = "none";
}

monthSelector.addEventListener("change", () => {
  const selectedMonth = parseInt(monthSelector.value);
  createCalendar(selectedMonth);
});

createMonthOptions();
createCalendar(new Date().getMonth());

function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();

  