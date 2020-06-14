$(() => {
  let chartNum = 0;               // current chart is going to be shown | first chart
  let s = 1;                      // scale of the whole chart
  const ignoredChannels = [];     // the deleted charts: [{chartNum, channelNum}]
  const numOfGridLines = 11;      // horizantal and vertical number of lines of grid
  const valuesEl = $("#values");  // the chart values | Y
  const chartsEl = $("#charts");  // the charts parent
  const timeEl = $("#time");      // the chart time | X
  const canvasWidth = 550;        // let this be fixed (ow. change the css)
  const canvasHeight = 450;       // let this be fixed (ow. change the css)
  $(".absolute, .relative").css({ width: `${canvasWidth}px`, height: `${canvasHeight}px` });

  let descFlag = false;
  let infoFlag = false;


  const props = {
    chartsEl,
    canvasWidth,
    canvasHeight,
    timeEl,
    valuesEl,
    numOfGridLines,
  }
  init({
    ...props,
    chartNum,
    s,
    ignoredChannels,
  });

  $("#zoomin").click(() => {
    if (s >= 1) {
      s += 0.2;
    }
    else {
      s += 0.1;
    }
    injectData({ ...props, chartNum, s, ignoredChannels }, false);
  });

  $("#reset-scale").click(() => {
    s = 1;
    injectData({ ...props, chartNum, s, ignoredChannels }, false);
  });

  $("#zoomout").click(() => {
    if (s > 1) {
      s -= 0.2;
    }
    else if (s > 0.2) {
      s -= 0.1;
    }
    else {
      return;
    }
    injectData({ ...props, chartNum, s, ignoredChannels }, false);
  });

  $("#prev").click(() => {
    chartNum--;
    if (chartNum === -1) {
      chartNum = window.noc - 1;
    }
    showChart(chartNum, numOfGridLines);
  });

  $("#next").click(() => {
    chartNum = (chartNum + 1) % window.noc;
    showChart(chartNum, numOfGridLines);
  });

  $("#desc-btn").click(() => {
    closeModals();
    descFlag = !descFlag;
    if (descFlag) {
      $.getJSON("/assets/data/chart.json", (data) => {
        const xTitle = data[chartNum].x.title;
        const yTitle = data[chartNum].y.title;
        const desc = data[chartNum].desc;
        $("#desc")
          .append(`<div>نمودار ${yTitle} بر حسب ${xTitle}</div>`)
          .append(`<div>${desc}</div>`)
          .append(window.graphs[chartNum].map((el, k) => shouldBeIgnored(ignoredChannels, chartNum, k) ? "" : `<div><div class="color-circle del-${chartNum}-${k}" style="background-color: ${el.color}"><i id="del-${chartNum}-${k}" class="fa fa-times del-btn"></i></div></div>`).join(""));
        $("#desc").removeClass("d-none");
        $("#desc-btn").addClass("border-full");
      });
    }
    else {
      $("#desc").addClass("d-none").find("div").remove("div");
      $("#desc-btn").removeClass("border-full");
    }
  });

  $("#info-btn").click(() => {
    closeModals();
    infoFlag = !infoFlag;
    if (infoFlag) {
      $("#info").removeClass("d-none");
      $("#info-btn").addClass("border-full");
    }
    else {
      $("#info").addClass("d-none");
      $("#info-btn").removeClass("border-full");
    }
  });

  $("#desc").click((e) => {
    if (/del-btn/g.test(e.target.className)) {
      const { id } = e.target;
      $(`.${id}`).addClass("d-none");
      const i = id.split("-")[1]; // chart number
      const j = id.split("-")[2]; // channel number
      ignoredChannels.push({ i, j });
      injectData({ ...props, chartNum, s, ignoredChannels }, false);
    }
  });

});

const init = (props) => {
  $("#desc-btn").html(`Chart <b style="color: #777">${props.chartNum + 1}</b> Description`);
  $.getJSON("/assets/data/chart.json", (data) => {
    window.noc = data.length; // number of charts in json data file
  });
  injectData(props, true);
}

const closeModals = () => {
  $(".modal-btn").removeClass("border-full");
  $(".modal").addClass("d-none");
}

