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

    var rDistrict = $("select[name='rDistrict']").val();

    var sDistrict = $("select[name='sDistrict']").val();

    if (!rDistrict || !sDistrict) {
      isEmpty = true;
    }

    if (isEmpty) {
      window.location.href = `/create-order?error=${encodeURI(
        "Please enter full information."
      )}`;

      return;
    }

    $(this).attr("type", "submit");

    $(this).click();
  });

  $("#confirmModel").on("shown.bs.modal", function(e) {
    var price = 0;

    var weight = parseFloat($("#ipWeight").val()); // 72.65

    if (weight > 2) {
      var rest = weight - 2; // 70.65

      price = 20 + Math.ceil(rest / 0.5) * 5;
    } else {
      price = 20;
    }

    var rDistrict = $("select[name='rDistrict']").val();

    if (rDistrict && rDistrict.indexOf("83") === 0) {
      price *= 1.5;
    }

    var realPrice = price * 1000;

    $("#ipPrice").val(realPrice);

    $("#infoPrice").remove();

    $(".modal-body").prepend(
      `<p id="infoPrice">Thành tiền đơn hàng của bạn là <b>${realPrice}</b>.</p>`
    );
  });
});