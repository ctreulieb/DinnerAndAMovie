// Author :  Craig Treulieb - 0606138
// Date: 26/03/2014
// File: dinnerandmovie.aspx.cs - contains getFactualTheatres and getFactualRestaurants methods to get Factual information
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using FactualDriver;
using FactualDriver.Filters;
using System.Web.Services;

namespace Mapping
{
    public partial class mapping : System.Web.UI.Page
    {
        /// <summary>
        /// Gets factual data for movie theatres based on location data and range passed in
        /// </summary>
        /// <param name="range">range of search radius</param>
        /// <param name="latitude">latitude of centre of search area</param>
        /// <param name="longitude">longitude of centre of search area</param>
        /// <returns>string containing JSON object of all the factual data</returns>
        [WebMethod]
        public static string getFactualTheatres(string latitude, string longitude, string range)
        {
            Factual factual = new Factual("si1Kd5PffswHOjb96c8MrBGdJRAmJ34NSHc0TJIP", "bgQJFKl7O87crb2A80kdkoDu7HGHdmXtAbALeQ93");

            factual.ConnectionTimeout = 100000;
            factual.ReadTimeout = 300000;

            double dLat;
            double dLon;
            int iRange;
            if (double.TryParse(latitude, out dLat) == false)
                dLat = 47.23591995239258;
            if (double.TryParse(longitude, out dLon) == false)
                dLon = -93.52752685546875;
            int.TryParse(range, out iRange);
            iRange *= 1000;
            return factual.Fetch("places", new Query()
                .WithIn(new Circle(dLat, dLon, iRange))
                .Limit(50)
                .Field("category_ids").Includes(332)
                );
        }
        /// <summary>
        /// Gets factual data for restaurants based on location data passed in
        /// </summary>
        /// <param name="latitude">latitude of centre of search area</param>
        /// <param name="longitude">longitude of centre of search area</param>
        /// <returns>string containing JSON object of all the factual data</returns>
        [WebMethod]
        public static string getFactualRestaurants(string latitude, string longitude)
        {
            Factual factual = new Factual("si1Kd5PffswHOjb96c8MrBGdJRAmJ34NSHc0TJIP", "bgQJFKl7O87crb2A80kdkoDu7HGHdmXtAbALeQ93");

            factual.ConnectionTimeout = 100000;
            factual.ReadTimeout = 300000;

            double dLat;
            double dLon;
            if (double.TryParse(latitude, out dLat) == false)
                dLat = 47.23591995239258;
            if (double.TryParse(longitude, out dLon) == false)
                dLon = -93.52752685546875;
            return factual.Fetch("places", new Query()
                .WithIn(new Circle(dLat, dLon, 5000))
                .Limit(50)
                .Field("category_ids").Includes(347)
                );
        }
    }
}