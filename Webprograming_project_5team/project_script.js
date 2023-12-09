var currentYear, currentMonth;
var events = {};

window.onload = function () {
    var date = new Date();
    currentYear = date.getFullYear();
    currentMonth = date.getMonth() + 1;
    updateCalendar();
}

document.getElementById('prevMonth').addEventListener('click', function () {
    currentMonth--;
    if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
    }
    updateCalendar();
});

document.getElementById('nextMonth').addEventListener('click', function () {
    currentMonth++;
    if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
    }
    updateCalendar();
});

function updateCalendar() {
    document.getElementById('calendarLabel').textContent = currentYear + '년 ' + currentMonth + '월';
    generateCalendar(currentYear, currentMonth);
}

function generateCalendar(year, month) {
    var date = new Date(year, month - 1, 1);
    var daysInMonth = new Date(year, month, 0).getDate();
    var dayOfWeek = date.getDay();
    var calendar = '<table><tr><th class="sunday">일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th class="saturday">토</th></tr><tr>';

    for (var i = 0; i < dayOfWeek; i++) {
        calendar += '<td></td>';
    }

    for (var i = 1; i <= daysInMonth; i++) {
        if (dayOfWeek == 7) {
            dayOfWeek = 0;
            calendar += '</tr><tr>';
        }
        var dayClass = '';
        if (dayOfWeek == 0) {
            dayClass = 'sunday';
        } else if (dayOfWeek == 6) {
            dayClass = 'saturday';
        }
        if (i === new Date().getDate() && currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth() + 1) {
            calendar += '<td class="' + dayClass + ' today" onclick="showEventForm(' + currentYear + ',' + currentMonth + ',' + i + ')">' + i + '</td>';
        } else {
            calendar += '<td class="' + dayClass + '" onclick="showEventForm(' + currentYear + ',' + currentMonth + ',' + i + ')">' + i + '</td>';
        }

        dayOfWeek++;
    }
    while (dayOfWeek < 7) {
        calendar += '<td></td>';
        dayOfWeek++;
    }
    calendar += '</tr></table>';
    $("#calendar").html(calendar);
}

function showEventForm(year, month, day) {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var dateString = year + "년 " + month + "월 " + day + "일";
    document.getElementById('eventDate').value = dateString;
    document.getElementById('eventTime').value = (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes;

    var eventKey = dateString + " " + document.getElementById('eventTime').value;
    if (events[eventKey]) {
        document.getElementById('eventContent').value = events[eventKey];
    } else {
        document.getElementById('eventContent').value = '';
    }

    document.getElementById('eventForm').style.display = 'block';
    
    setReminder(year, month, day, hours, minutes);
}

function setReminder(year, month, day) {
    var dateString = year + "년 " + month + "월 " + day + "일";

    var reminderDate = new Date(year, month - 1, day);
    var currentDate = new Date();
    var timeDiff = reminderDate.getTime() - currentDate.getTime();

    if (timeDiff > 0) {
        setTimeout(function () {
            showNotification("일정 알림", dateString + "의 일정이 있습니다!");
        }, timeDiff);
    } else {
        alert("이미 지난 날짜에는 알림을 설정할 수 없습니다.");
    }
}

function showNotification(title, body) {
    // Notification 권한 요청
    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
            // Notification 생성
            var notification = new Notification(title, { body: body });
        } else {
            alert("알림 권한이 없습니다.");
        }
    });
}

function saveEvent() {
    var eventDate = document.getElementById('eventDate').value;
    var eventTime = document.getElementById('eventTime').value;
    var eventContent = document.getElementById('eventContent').value;

    var eventKey = eventDate + " " + eventTime;
    events[eventKey] = eventContent;

    document.getElementById('eventForm').style.display = 'none';
}
