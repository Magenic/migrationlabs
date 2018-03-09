/// <reference path="../lib/knockout/dist/knockout.js" />
/// <reference path="../lib/knockout-mapping/knockout.mapping.js" />

function PicShareViewModel() {
    var self = this;

    // Upload Display
    self.shouldShowUpload = ko.observable(false);
    self.toggleUpload = function () {
        let curVal = self.shouldShowUpload();
        self.shouldShowUpload(!curVal);
    };

    // Photos
    self.pics = ko.observableArray([]);
    self.searchText = ko.observable('');
    self.page = ko.observable(0);
    self.searchPics = function () {
        // take and offset
        const pageSize = 30;
        let offset = pageSize * self.page();
        var curSearch = self.searchText();
        var searchParams = 'search=' + self.searchText() +
            '&take=' + self.pageSize +
            '&offset=' + offset;
        $.getJSON('/api/Pictures', searchParams, function (data) {
            //self.pics(ko.mapping.fromJS(data));
            self.pics(data);
        });
    };

    // Upload
    self.upload = function () {
        var form = document.getElementById('uploadForm');
        var formData = new FormData(form);
        formData.append('file', $('#image')[0].files[0]);

        $.ajax({
            url: $('#uploadForm').attr("action"),
            type: 'POST',
            data: formData,
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            success: function (data) {
                console.log(data);
                self.pics.push(data);
                form.reset();
                self.toggleUpload();
            }
        });
    };

    // Data Init
    self.searchPics();
}

ko.applyBindings(new PicShareViewModel());

$("#uploadForm").submit(function () {

    var formData = new FormData(this);

    $.post("/api/Pictures", formData, function (data) {
        alert(data);
    });

    return false;
});