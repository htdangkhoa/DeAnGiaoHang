$(document).ready(function() {
  $(".nav-item.active").removeClass("active");

  var pathName = location.pathname;

  switch (pathName) {
    case "/about": {
      $("#navAbout").addClass("active");
      break;
    }
    case "/contact": {
      $("#navContact").addClass("active");
      break;
    }
    case "/info":
    case "/login":
    case "/signup": {
      $("#navAccount").addClass("active");
      break;
    }
  }

  $("#btnNextToStep2").click(function() {
    $("#collapseOne").collapse("hide");

    $("#collapseOne").on("hidden.bs.collapse", function() {
      $("#collapseTwo").collapse("show");
    });
  });

  $("#btnNextToStep3").click(function() {
    $("#collapseTwo").collapse("hide");

    $("#collapseTwo").on("hidden.bs.collapse", function() {
      $("#collapseThree").collapse("show");
    });
  });

  $("#btnAddProduct").click(function() {
    $("#product-list").append($(".form-row.product-detail")[0].outerHTML);
  });
});
