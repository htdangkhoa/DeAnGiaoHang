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
    $("#collapseTwo").collapse("show");
  });

  $("#btnNextToStep3").click(function() {
    $("#collapseThree").collapse("show");
  });

  $("#btnAddProduct").click(function() {
    $("#product-list").append($(".form-row.product-detail")[0].outerHTML);
  });

  $("#btnConfirm").click(function() {
    var isEmpty = false;

    var type = $(this).attr("type");

    if (type !== "button") return;

    $("input[required]").each(function(index, ele) {
      if ($(ele).val().length === 0) {
        isEmpty = true;
      }
    });

    if (isEmpty) {
      window.location.href = `/create-order?error=${encodeURI(
        "Please enter full information."
      )}`;

      return;
    }

    $(this).attr("type", "submit");

    $(this).click();
  });
});
