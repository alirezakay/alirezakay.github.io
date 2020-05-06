$(function(){
  const score = $("#calc").find("#score");
  const submit = $("#calc").find("#submit");
  const result = $("#calc").find("#result");
  
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