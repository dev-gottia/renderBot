const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async () => {
  var urls = ["https://streamsgate.net/dashboard/boxing"];

  async function runScriptForURL(url) {
    const browser = await puppeteer.launch({
      args: ["--disable-setuid-sandbox", "--no-sandbox", "--no-zygote"],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    var page = await browser.newPage();

    var cookies = [
      {
        name: "laravel_session",
        value:
          "eyJpdiI6IjU1Y05ORkpxSWpXYXdleEVtckhiWGc9PSIsInZhbHVlIjoiTG14enNmaFkrZW1scnZ6cGZ3N1BzTlh3SXF2ZGcvbXRDblg0NnE5Mm15RExuWDVxeUhaOUZKRXNkQnNpUGRrRnBoMmZ4VWlmQ1hBY0tBWFcwVnR4amZlS0NXTUZWdFQydzZnNGpFcTkwUEJvVnByQmhJcXM4bElpOG5DUEFWaCsiLCJtYWMiOiIwZGE3ZjZjZTk4NDQzM2JkYTNkNjA4OWE4MzdlMGFmYjUzNjcxN2EzYjc0N2Y4ZTM1NDZiZjM4ZTVjNWU2YzM4IiwidGFnIjoiIn0%3D",
        domain: "streamsgate.net",
      },
      {
        name: "remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d",
        value:
          "eyJpdiI6IlU2b3ZQMDUwWUFuUkc2NCs4aFl1MFE9PSIsInZhbHVlIjoiZnY0ZmdQem5mZXNidGwzMHFFeloveklzdFBqbnIwa1RpdlBOMFVaWUtDSXZnQnAvcE9ZdzlKNW54bW82eVdIS0gvd0RyTUlwaUNVcDM3OUlna3d1OWNsNzR4T0QyK2k5dmZDS3N5ZTh1VXVQNTk5UU0wYjUwODRzbTBqYjc0VUZDUkRSN0tkV2JTQW5JbjlGVjlSR25FYTNXSXdSYXdFOTlIYTVPRHpmdFA3akh5dGFtSHB2U3JsOURweS9zU2pITTJHa3JXZXJPaWdJS3lDTXBLZnRFVTJDK3l4ankzcThaSHBjUDAveU94Zz0iLCJtYWMiOiI3NTViNjljNGI3ZTFhZDAxMjE3M2VmY2QzMmQ3MjQxZmVmZTM5MzUzZTBiMzUxMzg0YjljZDlhNzc2Yzg2Zjk4IiwidGFnIjoiIn0%3D",
        domain: "streamsgate.net",
      },
      {
        name: "XSRF-TOKEN",
        value:
          "eyJpdiI6InlmSVl2ZGZTekpkMFJneThSd2pLTVE9PSIsInZhbHVlIjoibi9SRTZDbnhHeFppWUx4S2xaenJvb2RaVjBHVVlYUVdDRTFGQmtaNWlVUngyS0JBTUorRENUbkhMSDg0WW1CVDhvRFE1QTJXK05VSkNCdjV3bGxES1ZMYU8xdmMwL1VKWjNxOGZzemdFMzNBdElrUGQ0M2ZLNVRkVjFTMUNLNFciLCJtYWMiOiI5YWE0MzM4ZDY1YzZhYzBmODY3NTBmODBjOTA5M2M2Mzg5YjQ5NWFjZTVmN2NhYTBkYjY3ZDEwMzJhZTFiMDUzIiwidGFnIjoiIn0%3D",
        domain: "streamsgate.net",
      },
    ];

    await page.setCookie(...cookies);

    // Navigate to the specified URL
    await page.goto(url, { timeout: 60000 });

    // Execute your script within the page context
    await page.evaluate(async () => {
      // Your script logic here
      var newData = {
        date: "",
        competitions: "all",
        search: "",
        status: "all",
        limit: $(".total").text(),
        type: $("#type").val(),
        _token: $('meta[name="csrf-token"]').attr("content"),
      };

      var mappedMatches = [];

      async function _getInfoLinkStreamOfMatch(
        requestUrl,
        method,
        params,
        hideDetail = true
      ) {
        try {
          var res = await callAjax(requestUrl, method, params);
          var statusCode = res.statusCode;

          if (statusCode === 2) {
            var streams = res.data;

            if (streams.matches && streams.matches.length > 0) {
              // Map the matches array to the global variable
              mappedMatches = streams.matches.map((match) => ({
                matchId: match.match_id,
                homeTeam: match.home_name,
                awayTeam: match.away_name,
                status: match.status,
                competition: match.competition,
                startTime: match.start_time, // Keep the original start time
                // Add more properties as needed
              }));

              // Get the current time in the local time zone
              var currentTime = moment.utc(); // Use UTC for the current time

              // Iterate over mappedMatches and make Ajax calls for events less than 50 hours away
              mappedMatches.forEach((match) => {
                // Convert start time to a moment object
                var startTime = moment.utc(match.startTime);

                // Calculate the time difference in hours
                var timeDifference = startTime.diff(currentTime, "hours");

                // Check if the event is less than 50 hours away
                if (timeDifference < 50 && timeDifference >= 0) {
                  var data = {
                    _token: $('meta[name="csrf-token"]').attr("content"),
                    match_id: match.matchId,
                    channel_name: "AbdulBhaigg SPORT STREAM HD",
                    link: "https://sg.shora-streams.cf/p/sp1.html?ch=ch1",
                    stream_type: "Web",
                    quality: "HD",
                    language: "English",
                    ads: "1",
                    bitrate: "4000",
                    misr: "2MB",
                    visible: true,
                    mobile_compatible: true,
                    nsfw: false,
                    adblock: false,
                    type: $("#type").val(),
                  };

                  console.log("Making Ajax call for match:", match.matchId);
                  MakeActualAjaxCall("/add/stream", "POST", data);
                }
              });
            }
          } else {
            console.error("Error:", res.message);
          }

          $("#loading").fadeOut(500);
        } catch (error) {
          console.error("Error:", error);
          $("#loading").fadeOut(500);
        }
      }

      // Correct function call
      await _getInfoLinkStreamOfMatch("/dashboard/", "POST", newData);

      async function MakeActualAjaxCall(url, method, data) {
        try {
          await $.ajax({
            url: url,
            data: data,
            type: method,
          });

          console.log("Posted Successfully");
        } catch (err) {
          console.error("Error:", err);
        }
      }
    });

    // Close the browser
    setTimeout(() => browser.close(), 60000);
  }

  // Function to run the entire program
  async function runProgram() {
    // Iterate over each URL and run the script
    for (var url of urls) {
      await runScriptForURL(url);
    }
  }

  // Run the program initially
  runProgram();

  schedule.scheduleJob("20 * * * *", async () => {
    // Run the program every hour at 1 minute past the hour
    await runProgram();
  });
};

module.exports = { scrapeLogic };
