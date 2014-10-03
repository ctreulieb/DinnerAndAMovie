<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="dinnerandmovie.aspx.cs" Inherits="Mapping.mapping" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Mapping</title>
    <link rel="stylesheet" type="text/css" href="styles/foundation.min.css" />
    <script type="text/javascript" src="scripts/default.js"></script>
    <script type="text/JavaScript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>
    <script type="text/javascript" src="scripts/jquery-1.7.1.js"></script>
</head>
<body onload="boot();">
    <form id="form1" runat="server">
        <div class="row">
            <div id="title" class="large-12 columns"><h1>Dinner and a Movie!</h1></div>
            <div id="myForm" class="large-3 columns controlarea">
                <div class="large-12 small-3 columns">Address:<input type="text" id="tAddress" onkeydown="if (event.keyCode == 13){ clickFindTheatres(); return false;}" /></div>
                <div class="large-3 small-1 columns">Range: </div>
                <div class="large-9 small-2 columns">
                    <select id="sRange">
                        <option value="5">5km</option>
                        <option value="10">10km</option>
                        <option value="15">15km</option>
                        <option value="20">20km</option>
                        <option value="25">25km</option>
                    </select>
                </div>
                <div class="large-12 small-3 columns"><button class="button" type="button" onclick="clickFindTheatres()">Use Provided Address</button></div>
                <div class="large-12 small-3 columns"><button class="button" type="button" onclick="searchCurrentLocation()">Use Your Location</button>                </div>
                <div class="large-12 small-12 columns show-for-large-up"><p>Search for near by theatres by typing an address, or your current location. Cick a film icon to see more information about that theatre. Click the infobox to select it and see near by restaurants. Click the fork icon to see information about that restaurant, and click the information box to select that restaurant to get driving directions.</p></div>
            </div>
            <div id="bingMap" style="height:400px;" class="large-9 columns maparea"></div>
        </div>
    </form>
</body>
</html>