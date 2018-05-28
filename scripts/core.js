var connection = new JsStore.Instance(new Worker('scripts/jsstore.worker.js'));
var RecordId;

// init
initiateDb();
getRecord();

// fire up the data
function initiateDb() {
  var DbName = 'Records';
  connection.isDbExist(DbName).then(function (isExist) {
    if (isExist) {
      connection.openDb(DbName).then(function() {
        console.log('db opened');
      });
    } else {
      var DataBase = getDatabase();
      connection.createDb(DataBase).then(function (tables) {
        console.log(tables);
      });
      window.location.href = 'index.html';
    }
  }).catch(function (err) {
    console.log(err.message);
  });
}
function getDatabase() {
  var tblRecord = {
    name: 'Record',
    columns: [{
      name: 'Id',
      primaryKey: true,
      autoIncrement: true
    },
    {
      name: 'Artist',
      notNull: true,
      dataType: 'string'
    },
    {
      name: 'Album',
      notNull: true,
      dataType: 'string'
    },
    {
      name: 'Year',
      notNull: true,
      dataType: 'string'
    },
    {
      name: 'Condition',
      notNull: true,
      dataType: 'string'
    },
    {
      name: 'Tags',
      notNull: true,
      dataType: 'string'
    }
  ]}
  var dataBase = {
    name: 'Records',
    tables: [tblRecord]
  }
  return dataBase;
}

// show & refresh data
function showData() {
  connection.select({
    from: 'Record'
  }).then(function (records) {
    if (records.length === 0) {
      $('#noRecords').show();
    } else {
      $('#noRecords').hide();
    }
    var HtmlString = '';
    records.forEach(function (record) {
      HtmlString += "<div ItemId=" + record.Id + ">" +
        "<div class='coreMod'><a href='artist.html?artist=" + encodeURIComponent(record.Artist) + "'>" + record.Artist + "</a></div>" +
        "<div class='coreMod'>" + record.Album + "</div>" +
        "<div class='coreMod'>" + record.Year + "</div>" +
        "<div class='coreMod'>" + record.Condition + "</div>" +
        "<div class='coreMod'>" + record.Tags + "</div>" +
        "<div class='coreMod'><a href='#' class='edit'>Edit</a></div>" +
        "<div class='coreMod'><a href='#' class='delete'>Delete</a></div></div>";
    })
    $('#dashCore').html(HtmlString);
  }).catch(function(err) {
    console.log(err.message);
  });
}

// search records
function Find() {
  var searchQry = $('#search').val();
  window.location.href = 'search.html?query=' + searchQry;
}
function getRecords() {
  var Records = [];
  return Records;
}

// get query params
function getParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getRecord() {
  RecordId = getParam('id');
  if(RecordId) {
    connection.select({
      from: 'Record',
      where: {
        Id: Number(RecordId)
      }
    }).then(function (results) {
      if (results.length > 0) {
        var Record = results[0];
        $('#txtArtist').val(Record.Artist);
        $('#txtAlbum').val(Record.Album);
        $('#txtYear').val(Record.Year);
        $('#txtCondition').val(Record.Condition);
        $('#txtTags').val(Record.Tags);
      } else {
        console.log('Invalid record id');
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  }
}

// add record
function addRecord() {
  var Value = {
    Artist: $('#txtArtist').val(),
    Album: $('#txtAlbum').val(),
    Year: $('#txtYear').val(),
    Condition: $('#txtCondition').val(),
    Tags: $('#txtTags').val().replace(/,/g, ' ')
  };
  connection.insert({
    into: 'Record',
    values: [Value]
  }).then(function (rowsAdded) {
    console.log(rowsAdded + ' record Added');
    window.location.href = 'index.html';
  }).catch(function (err) {
    console.log(err.message);
  });
}

// delete record
function deleteData(recordId) {
  connection.remove({
    from: 'Record',
    where: {
      Id: Number(recordId)
    }
  }).then(function (rowsDeleted) {
    console.log(rowsDeleted + ' rows deleted');
    if (rowsDeleted > 0) {
      showData();
      buildArtist();
      buildResults();
    }
  }).catch(function (err) {
    console.log(err.message);
  });
}

// update record
function updateRecord() {
  var Value = {
    Artist: $('#txtArtist').val(),
    Album: $('#txtAlbum').val(),
    Year: $('#txtYear').val(),
    Condition: $('#txtCondition').val(),
    Tags: $('#txtTags').val().replace(/,/g, ' ')
  };
  connection.update({ in: 'Record',
    set: Value,
    where: {
      Id: Number(RecordId)
    }
  }).then(function (rowsAffected) {
    console.log(rowsAffected + ' record Updated');
    if (rowsAffected > 0) {
      window.location.href = 'index.html';
    }
  }).catch(function (err) {
    console.log(err.message);
  });
}

// add & update submit
function submit() {
  if (RecordId) {
    updateRecord();
  } else {
    addRecord();
  }
}
function cancel() {
  window.location.href = 'index.html';
}

// search records
function Find() {
  var searchQry = $('#search').val();
  window.location.href = 'search.html?query=' + searchQry;
}

// sort
function sort() {
  connection.select({
    from: 'Record',
    order: {
      by: 'Artist',
      type: 'asc'
    }
  }).then(function (records) {
    var HtmlString = '';
    records.forEach(function (record) {
      HtmlString += "<div ItemId=" + record.Id + ">" +
        "<div class='coreMod'><a href='artist.html?artist=" + encodeURIComponent(record.Artist) + "'>" + record.Artist + "</a></div>" +
        "<div class='coreMod'>" + record.Album + "</div>" +
        "<div class='coreMod'>" + record.Year + "</div>" +
        "<div class='coreMod'>" + record.Condition + "</div>" +
        "<div class='coreMod'>" + record.Tags + "</div>" +
        "<div class='coreMod'><a href='#' class='edit'>Edit</a></div>" +
        "<div class='coreMod'><a href='#' class='delete'>Delete</a></div></div>";
    })
    $('#dashCore').html(HtmlString);
  }).catch(function(err) {
    console.log(err.message);
  });
}

// build artists
function buildArtist() {
  var artist = getParam('artist');
  connection.select({
    from: 'Record',
    where: {
      Artist: artist
    }
  }).then(function (records) {
    // get the artist
    function getArtist(set, properties) {
      return set.filter(function (entry) {
        return Object.keys(properties).every(function (key) {
          return entry[key] === properties[key];
        });
      });
    }
    var results = getArtist(records, { Artist: artist });
    $('#artistName').html(artist + ' (' + results.length + ')');

    // show all records by artist
    if (records.length === 0) {
      window.location.href = 'index.html';
    }
    var HtmlString = '';
    records.forEach(function (record) {
      HtmlString += "<div ItemId=" + record.Id + ">" +
        "<div class='coreMod'><a href='artist.html?artist=" + encodeURIComponent(record.Artist) + "'>" + record.Artist + "</a></div>" +
        "<div class='coreMod'>" + record.Album + "</div>" +
        "<div class='coreMod'>" + record.Year + "</div>" +
        "<div class='coreMod'>" + record.Condition + "</div>" +
        "<div class='coreMod'>" + record.Tags + "</div>" +
        "<div class='coreMod'><a href='#' class='edit'>Edit</a></div>" +
        "<div class='coreMod'><a href='#' class='delete'>Delete</a></div></div>";
    })
    $('#dashCore').html(HtmlString);

    // pull years from artist and sort
    var artistTotalYears = [];
    for (var i = 0; i < results.length; i++) {
      var years = results[i].Year;
      artistTotalYears.push(years);
    }
    var artistUniqueYears = [...new Set(artistTotalYears)];

    // count records per year
    albumCount = [];
    artistTotalYears.sort((a, b) => a - b).forEach(function(obj) {
      var key = JSON.stringify(obj);
      albumCount[key] = (albumCount[key] || 0) + 1;
    });
    albumTotalCount = Object.values(albumCount)

    // chart
    new Chart(document.getElementById('bar-chart'), {
      type: 'bar',
      data: {
        labels: artistUniqueYears.sort((a, b) => a - b),
        datasets: [{
          label: 'Albums',
          data: albumTotalCount,
          backgroundColor: 'rgba(9, 100, 170, 1)',
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function(value) {if (Number.isInteger(value)) {return value;}},
              stepSize: 1
            }
          }]
        }
      }
    });
  }).catch(function(err) {
    console.log(err.message);
  });
}

// build search results
function buildResults() {
  var query = getParam('query');
  connection.select({
    from: 'Record',
    where: {
      Artist: {
        like: '%' + query.charAt(0).toUpperCase() + query.slice(1) + '%'
      },
      or: {
        Artist: {
          like: '%' + query + '%'
        },
        Album: {
          like: '%' + query + '%'
        },
        Year: query,
        Condition: query,
        Tags: {
          like: '%' + query + '%'
        },
        Album: {
          like: '%' + query.charAt(0).toUpperCase() + query.slice(1) + '%'
        },
        Year: query.charAt(0).toUpperCase() + query.slice(1),
        Condition: query.charAt(0).toUpperCase() + query.slice(1),
        Tags: {
          like: '%' + query.charAt(0).toUpperCase() + query.slice(1) + '%'
        }
      }
    }
  }).then(function(records) {
    if (records.length === 0) {
      window.location.href = 'index.html';
    }
    $('#queryName').html(query + ' (' + records.length + ')');
    var HtmlString = '';
    records.forEach(function(record) {
      HtmlString += "<div ItemId=" + record.Id + ">" +
        "<div class='coreMod'><a href='artist.html?artist=" + encodeURIComponent(record.Artist) + "'>" + record.Artist + "</a></div>" +
        "<div class='coreMod'>" + record.Album + "</div>" +
        "<div class='coreMod'>" + record.Year + "</div>" +
        "<div class='coreMod'>" + record.Condition + "</div>" +
        "<div class='coreMod'>" + record.Tags + "</div>" +
        "<div class='coreMod'><a href='#' class='edit'>Edit</a></div>" +
        "<div class='coreMod'><a href='#' class='delete'>Delete</a></div></div>";
    })
    $('#dashCore').html(HtmlString);
  }).catch(function(err) {
    console.log(err.message);
  });
}