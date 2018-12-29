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

  $("#product-list").bind("DOMNodeInserted", function(event) {
    const indexInserted = $(this).children(".form-row.product-detail").length;

    if (indexInserted > 1) {
      $("#btnRemoveProduct").attr("disabled", false);
    }
  });

  $("#product-list").bind("DOMNodeRemoved", function(event) {
    const indexRemoved = $(this).children(".form-row.product-detail").length;

    if (indexRemoved <= 2) {
      $("#btnRemoveProduct").attr("disabled", true);
    }
  });

  $("#btnAddProduct").click(function() {
    $("#product-list").append($(".form-row.product-detail")[0].outerHTML);
  });

  $("#btnRemoveProduct").click(function() {
    const productForms = $(".form-row.product-detail");

    if (productForms.length < 2) return;

    $(productForms[productForms.length - 1]).remove();
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

      // Math.celi là tính số lần cân nặng vượt khỏi 0.5kg.
      // sau đó lấy số lần vượt, nhân cho 5k.
      price = 20 + Math.ceil(rest / 0.5) * 5;
    } else {
      price = 20;
    }

    var rDistrict = $("select[name='rDistrict']").val();

    // Ứng với đầu code là 83 (là ngoại thành), thì giá tiền nhân tiếp cho 1.5.
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
