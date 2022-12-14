const CharityApi = class {
  constructor() {
    this.data = [];
  }
  async getAllCharity() {
    this.data = await $.get("/charities");
    this.data.forEach((charity) => {
      charity.img = getRandomImage();
    });
    $("#resultsNumber").text(this.data.length);
    const renderer = new Renderer(
      $("#charities-container"),
      $("#charities-template")
    );
    renderer.renderCharities(this.data);
  }

  getByName = function (charitySpecific) {
    $.get(`/charity/${charitySpecific}`, async (response) => {
      response.total = await this.getTotalAmount(charitySpecific);
      const renderer = new Renderer(
        $("#charity-container"),
        $("#charity-template")
      );
      renderer.renderCharity(response);
      deleteCharity();
    });
  };

  getClassificationCharity(charityClassification) {
    $.ajax({
      type: "get",
      cache: false,
      url: `/charities/${charityClassification}`,
      error: function (request, error) {
        throw Error(error);
      },
      success: function (response) {
        console.log(response);
        response.forEach((charity) => {
          charity.img = getRandomImage();
          console.log(charity);
        });
        $("#resultsNumber").text(response.length);
        const renderer = new Renderer(
          "#charities-container",
          "#charities-template"
        );
        renderer.renderCharities(response);
      },
    });
  }
  async donate(name, amount, nameOfcharity) {
    const donorInfo = {
      name: name,
      amount: amount,
      nameOfcharity: nameOfcharity,
    };
    await $.post("/donate", donorInfo);
    this.getByName(nameOfcharity);
  }
  async getTotalAmount(charityName) {
    let totalamount = 0;
    try {
      const response = await $.get(`/charityAmount/${charityName}`);
      response.doners.forEach((element) => {
        totalamount += element.amount;
      });
      return totalamount;
    } catch (e) {
      throw Error(error);
    }
  }
  async filltringCharity(name) {
    let newArray = this.data.filter((e) => {
      if (e.name.toLowerCase().includes(name.toLowerCase())) {
        return e;
      }
    });
    $("#resultsNumber").text(newArray.length);

    const renderer = new Renderer(
      $("#charities-container"),
      $("#charities-template")
    );
    renderer.renderCharities(newArray);
  }
};
