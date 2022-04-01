const app = {};

app.getLaunch = function (query) {
  $(".results").empty();

  $.ajax({
    url: `https://api.spacexdata.com/v3/launches/past`,
    method: "GET",
    data: query,
  }).then(function (response) {
    app.showRockets(response);
  });
};

app.showRockets = function (data) {
  if (data.length === 0) {
    const noResult = `
    <div class="noResultMessage">
    <p>No results found.</p>
    </div>
    `;
    $(".results").append(noResult);
    hideSpinner();
    return;
  }

  data.forEach(function (launches) {
    if (launches.links.mission_patch_small) {
      const launchPage = `
        <div class="launchBox">
            <div class="launchPatch">
       <img src="${launches.links.mission_patch_small}" alt="${launches.name}">
        </div>
        <div>
        <p>Rocket: ${launches.name ? launches.name : launches.mission_name}</p>
        <p>Launch Date: ${new Date(launches.launch_date_utc).toLocaleString()}
        <p>Mission Details:<br/> ${
          launches.details ? `<p>${launches.details}</p>` : ""
        }
       </div> 
        </div>
        `;
      $(".results").append(launchPage);
    }
  });
  app.hideSpinner();
};

app.search = function () {
  app.showSpinner();
  const searchInput = $(".searchInput").val();
  const start = $("#start").val();
  const end = $("#end").val();
  const query = {};

  if (searchInput) {
    query.rocket_name = searchInput;
  }
  if (start && end) {
    query.start = start;
    query.end = end;
  }
  app.getLaunch(query);
};

// Spinner
app.showSpinner = function () {
  document.getElementsByClassName("loader")[0].style.display = "block";
};
app.hideSpinner = function () {
  document.getElementsByClassName("loader")[0].style.display = "none";
};

$(document).ready(function () {
  // Fade in text
  $(".fadeInText ").fadeIn(3000).removeClass("hidden");

  $("#searchButton").on("click", function () {
    app.search();
  });
});
