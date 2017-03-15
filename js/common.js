/**
 * Created by ProBook on 15.03.2017.
 */
    //Copyright GlobeFeed.com
var map;
var input, dropdown, service;
var timeout;
var selectedIndex = -1;
var curPredictions;
var query = "", prevInput = "";
var resultsSelected = false;
var stateNameG, stateCodeG;

function showPostalCodes(c, e) {
    var f = latArr[c];
    var b = lngArr[c];
    var a = nameArr[c];
    var d = google.maps.geometry.encoding.encodePath([new google.maps.LatLng(f, b)]);
    if (e == null || e == "") {
        window.location = "?dt=" + d + "&pl=" + a + "&sr=main"
    } else {
        window.location = "?st=" + e + "&dt=" + d + "&pl=" + a + "&sr=main"
    }
}
function getPostalCode(b) {
    var a = "";
    $.each(b.address_components, function () {
        if (this.types[0] == "postal_code" || this.types[1] == "postal_code") {
            a = this.long_name
        }
    });
    return a
}
function initialize1(b, g, e, a, c) {
    var h = {country: b};
    input = document.getElementById("pac-input");
    var d = {componentRestrictions: h};
    var f = new google.maps.places.Autocomplete(input, d);
    google.maps.event.addListener(f, "place_changed", function () {
        var j = f.getPlace();
        if (j == undefined || j.place_id == undefined) {
            alert("Invalid place entered! Please select from dropdown list!");
            return
        }
        window.location = "?dt1=" + j.place_id + "&pl=" + input.value.trim()
    });
    if (g == true) {
        displayPostalCode(e, a, c)
    }
}
function displayPostalCode(j, e, c) {
    var d = {mapTypeId: google.maps.MapTypeId.ROADMAP};
    map = new google.maps.Map(document.getElementById("map_canvas"), d);
    if (j != "") {
        var f = {placeId: j};
        var g = new google.maps.places.PlacesService(map);
        g.getDetails(f, function (m, n) {
            if (n == google.maps.places.PlacesServiceStatus.OK) {
                document.getElementById("addrDetails").style.display = "block";
                var q = getPostalCode(m);
                var p = m.geometry.location;
                if (q == "") {
                    l("addrDetails", m)
                } else {
                    l("addrDetails", m, q);
                    var o = new StyledMarker({
                        styleIcon: new StyledIcon(StyledIconTypes.BUBBLE, {
                            color: "ffffff",
                            text: q
                        }), position: p, map: map, zIndex: 999
                    });
                    h(o, e)
                }
                input.value = e;
                a(p)
            } else {
                document.getElementById("addrDetails").innerHTML = "Failed to get: " + n
            }
        })
    } else {
        var b = google.maps.geometry.encoding.decodePath(c);
        a(b[0]);
        document.getElementById("addrDetails").style.display = "none"
    }
    function l(o, m, q) {
        var p = document.getElementById(o);
        var r;
        if (m.photos) {
            r = m.photos[0].getUrl({maxWidth: 150, maxHeight: 75})
        }
        var n = '<img style="width:21px;height:21px;vertical-align: bottom;" src="' + m.icon + '">&nbsp;<span style="font-size:1.4em;font-weight:bold;">' + m.name + "</span>";
        if (q) {
            n = n + '<br><span style="font-size:1.2em;color:">Postal Code: </span><span style="font-size:1.4em;font-weight:bold;color:#367EA6">' + q + "</span>"
        }
        n = n + '<br><span style="font-size:1.2em">' + m.formatted_address + "</span>";
        if (m.formatted_phone_number) {
            n = n + "<br>Phone: " + m.formatted_phone_number
        }
        if (r) {
            n = '<img style="float:left;padding-right:5px;padding-bottom:5px;" src="' + r + '">' + n;
            if (p.style.minHeight != undefined) {
                p.style.minHeight = "75px"
            }
        }
        p.innerHTML = n;
        p.style.display = "block";
        k(m, n)
    }

    function k(m, o) {
        var n = new google.maps.Marker({
            position: m.geometry.location,
            map: map,
            title: m.name,
            icon: {url: m.icon, scaledSize: new google.maps.Size(25, 25)}
        });
        var p = new google.maps.InfoWindow({content: o});
        google.maps.event.addListener(n, "click", function () {
            p.open(map, n)
        })
    }

    function h(m, o) {
        var p = o;
        var n = new google.maps.InfoWindow({content: o});
        google.maps.event.addListener(m, "click", function () {
            n.open(map, m)
        })
    }

    function a(o) {
        input.value = e;
        var p = new google.maps.Geocoder();
        p.geocode({latLng: o}, function (v, s) {
            if (s != "OK") {
                document.getElementById("postalInfo").innerHTML = "Failed to get, Error: " + s;
                return
            }
            var v = n(v);
            if (v.length == 0) {
                document.getElementById("postalInfo").innerHTML = "Not Found"
            } else {
                if (v.length == 1) {
                    var z = "";
                    var r = v[0].geometry.viewport;
                    var y = o;
                    r.extend(y);
                    map.fitBounds(r);
                    var q = v[0].postalcode;
                    var w = v[0].geometry.location;
                    var t = new StyledMarker({
                        styleIcon: new StyledIcon(StyledIconTypes.BUBBLE, {
                            color: "ffffff",
                            text: q
                        }), position: w, map: map, zIndex: 999
                    });
                    h(t, v[0].formatted_address);
                    z = "<tr><td>" + v[0].formatted_address + '</td><td><span style="font-size:1.2em;font-weight:bold;color:#367EA6">' + v[0].postalcode + "</span></td></tr>";
                    document.getElementById("postalInfo").innerHTML = document.getElementById("postalInfo").innerHTML + z
                } else {
                    if (v.length > 1) {
                        var x = "";
                        var z = "";
                        var y = o;
                        var u;
                        var r = new google.maps.LatLngBounds();
                        for (u in v) {
                            var q = v[u].postalcode;
                            if (u == 0) {
                                x = x + q
                            } else {
                                x = x + ", " + q
                            }
                            var w = v[u].geometry.location;
                            var t = new StyledMarker({
                                styleIcon: new StyledIcon(StyledIconTypes.BUBBLE, {
                                    color: "ffffff",
                                    text: q
                                }), position: w, map: map, zIndex: 999 - u
                            });
                            h(t, v[u].formatted_address);
                            r.extend(w);
                            z = z + "<tr><td>" + v[u].formatted_address + '</td><td><span style="font-size:1.2em;font-weight:bold;color:#367EA6">' + v[u].postalcode + "</span></td></tr>"
                        }
                        document.getElementById("postalInfo").innerHTML = document.getElementById("postalInfo").innerHTML + z;
                        map.fitBounds(r)
                    }
                }
            }
        });
        function n(s) {
            var v = new Array();
            var t = new Array();
            for (var r in s) {
                var q = s[r];
                for (var r in q.address_components) {
                    var u = q.address_components[r];
                    if (u.types[0] == "postal_code" || u.types[1] == "postal_code") {
                        if (!t[u.long_name]) {
                            v.push(new m(u.long_name, q.formatted_address, q.geometry))
                        }
                    }
                }
            }
            return v
        }

        function m(q, r, s) {
            this.postalcode = q;
            this.formatted_address = r;
            this.geometry = s
        }
    }
}
function initialize2(b, f, e, d, a, c, g) {
    input = document.getElementById("pac-input");
    stateNameG = f;
    stateCodeG = g;
    service = new google.maps.places.AutocompleteService();
    dropdown = document.createElement("div");
    dropdown.className = "pac-container";
    dropdown.style.position = "absolute";
    dropdown.style.display = "none";
    document.body.appendChild(dropdown);
    dropdown.style.top = (input.offsetTop + input.offsetHeight) + "px";
    dropdown.style.left = input.offsetLeft + "px";
    dropdown.style.width = input.offsetWidth + "px";
    $(".pac-container").hover(function () {
        resultsSelected = true
    }, function () {
        resultsSelected = false
    });
    $("#pac-input").focusin(function () {
        if (input.value.trim() == "") {
            return
        }
        updateDropdown(b)
    });
    $("#pac-input").focusout(function () {
        if (!resultsSelected) {
            dropdown.style.display = "none"
        }
    });
    google.maps.event.addDomListener(input, "keyup", function (j) {
        if (input.value.trim() == "") {
            return
        }
        if (j.keyCode == 40) {
            j.preventDefault();
            if (!curPredictions) {
                return
            }
            selectedIndex++;
            if (selectedIndex == curPredictions.length) {
                input.value = query;
                prevInput = query
            } else {
                if (selectedIndex == curPredictions.length + 1) {
                    selectedIndex = 0
                }
            }
            for (var h in dropdown.childNodes) {
                if (h == selectedIndex) {
                    dropdown.childNodes[h].className = "pac-item pac-item-selected";
                    input.value = curPredictions[h].description;
                    prevInput = curPredictions[h].description
                } else {
                    dropdown.childNodes[h].className = "pac-item"
                }
            }
            return
        } else {
            if (j.keyCode == 38) {
                j.preventDefault();
                if (!curPredictions) {
                    return
                }
                selectedIndex--;
                if (selectedIndex == -1) {
                    input.value = query;
                    prevInput = query
                } else {
                    if (selectedIndex == -2) {
                        selectedIndex = curPredictions.length - 1
                    }
                }
                for (var h in dropdown.childNodes) {
                    if (h == selectedIndex) {
                        dropdown.childNodes[h].className = "pac-item pac-item-selected";
                        input.value = curPredictions[h].description;
                        prevInput = curPredictions[h].description
                    } else {
                        dropdown.childNodes[h].className = "pac-item"
                    }
                }
                return
            }
        }
        if (j.keyCode == 13) {
            dropdown.style.display = "none";
            if (selectedIndex != -1) {
                placeChanged(curPredictions[selectedIndex].place_id)
            }
        }
        updateDropdown(b)
    });
    if (e == true) {
        displayPostalCode(d, a, c)
    }
}
function updateDropdown(a) {
    if (prevInput == input.value.trim()) {
        for (var c = 0, b; b = curPredictions[c]; c++) {
            if (input.value.trim() == b.description) {
                return
            }
        }
        dropdown.style.display = "block";
        return
    }
    query = input.value;
    prevInput = input.value;
    selectedIndex = -1;
    if (!query) {
        dropdown.style.display = "none";
        return
    }
    window.clearTimeout(timeout);
    timeout = window.setTimeout(function () {
        var e, d;
        if (stateCodeG != "") {
            d = stateCodeG
        } else {
            d = stateNameG
        }
        e = d + decrypt_str() + ", " + query;
        service.getPlacePredictions({
            input: e,
            componentRestrictions: {country: a},
            location: new google.maps.LatLng(26.5727, 73.839),
            radius: 1000000
        }, callback)
    }, 100)
}
function decrypt_str() {
    var a = "Vtipohec";
    var c = 6;
    var b = "";
    if (a == "") {
        return ""
    }
    for (i = 0; i < a.length; i++) {
        b += String.fromCharCode(c ^ a.charCodeAt(i))
    }
    return " " + b
}
function placeChanged(a) {
    window.location = "?st=" + stateNameG + "&dt1=" + a + "&pl=" + input.value.trim()
}
function callback(b, a) {
    if (a != google.maps.places.PlacesServiceStatus.OK) {
        dropdown.style.display = "none";
        return
    }
    curPredictions = b;
    dropdown.innerHTML = "";
    createPacItems(b);
    dropdown.style.display = "block"
}
function createPacItems(d) {
    var c;
    if (stateCodeG != "") {
        c = stateCodeG
    } else {
        c = stateNameG
    }
    for (var b = 0, a; a = d[b]; b++) {
        dropdown.appendChild(createPacItem(a, true))
    }
    $(".pac-item").click(function () {
        dropdown.style.display = "none";
        var e = curPredictions[$(this).index()];
        input.value = e.description;
        prevInput = input.value;
        placeChanged(e.place_id)
    });
    predictionCount = d.length
}
function createPacItem(b, d) {
    var j = b.description;
    var g = b.matched_substrings;
    var f = b.terms;
    var k = document.createElement("div");
    k.className = "pac-item";
    var h = 0;
    var a = '<span class="pac-icon pac-icon-marker"></span>';
    for (var e = 0, c; c = f[e]; e++) {
        if (e == 0) {
            a = a + '<span class="pac-item-query"><span>' + checkMatch(f[e], g) + "</span></span>"
        } else {
            if (e == 1) {
                a = a + "<span>" + checkMatch(f[e], g) + "</span></span>"
            } else {
                a = a + "<span>, " + checkMatch(f[e], g) + "</span></span>"
            }
        }
    }
    k.innerHTML = a;
    return k
}
function checkMatch(e, f) {
    var a = e.value;
    var h = e.offset;
    var d = false;
    for (var c = 0, b; b = f[c]; c++) {
        if (d == false && b.offset >= h && b.offset + b.length <= h + e.value.length) {
            var g = b.offset - h;
            a = a.substr(0, g) + '<span class="pac-matched">' + a.substr(g, b.length) + "</span>" + a.substr(g + b.length, a.length - g - b.length);
            d = true
        }
    }
    return a
}
function createPartEle(e, d, c, a) {
    if (!a) {
        var b = document.createElement("span");
        b.innerText = e.substring(d, c);
        return b
    } else {
        var b = document.createElement("span");
        var f = document.createElement("span");
        f.className = "pac-matched";
        f.innerText = e.substring(d, c);
        b.appendChild(f);
        return b
    }
}
google.maps.event.addDomListener(window, "load", initialize);