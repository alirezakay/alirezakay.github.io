$(function(){
  const score = $("#calc").find("#score");
  const submit = $("#calc").find("#submit");
  const result = $("#calc").find("#result");
  const exp = $("#exp");
  
  const inter = setInterval(() => {
    const endTime = new Date("2020/5/13-12:00:00");
    const startTime = new Date();
    const dur = (endTime - startTime)/1000; // In seconds
    if(dur <= 1){
      console.log("DOODLE TIME SELECTION HAS BEEN ENDED!");
      clearInterval(inter);
      $("#doodle").attr("href", "https://doodle.com").addClass("disabled").text("Doodle Time Selection Link (EXPIRED)");
    }
    let days = dur/(24*60*60);
    let hours = (days - Math.floor(days)) * 24;
    let mins = (hours - Math.floor(hours)) * 60;
    let secs = (mins - Math.floor(mins)) * 60;
    days = Math.floor(days);
    hours = Math.floor(hours);
    mins = Math.floor(mins);
    secs = Math.floor(secs);
    exp.html(`<b>${days}</b> days <b>${hours}</b> hours <b>${mins}</b> mins <b>${secs}</b> secs`);
  }, 1000);
  
  score.change(function(e){
    const val = parseInt(e.target.value, 10);
    let grade = 0;
    if (val === 0){
      grade = 0;
    }
    else if (val < 30){
      grade = 30;
    }
    else{
      grade = Math.ceil(0.2 * val + 80);
    }
    result.text(grade);
  });
  submit.click(function(){
    const val = parseInt(score.val(), 10);
    let grade = 0;
    if (val === 0){
      grade = 0;
    }
    else if (val < 30){
      grade = 30;
    }
    else{
      grade = Math.ceil(0.2 * val + 80);
    }
    result.text(grade);
  });
});