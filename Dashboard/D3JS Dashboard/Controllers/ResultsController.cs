using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Net.Http;
using D3JS_Dashboard.Models;
using System.Threading.Tasks;

namespace D3JS_Dashboard.Controllers
{
    public class ResultsController : Controller
    {
        // GET: Results
        public ActionResult Home()
        {
            return PartialView();
        }
        public ActionResult histogram()
        {
            GetSkills();
            return PartialView();
        }
        public ActionResult DrillDownCharts()
        {
            return View();
        }
        public ActionResult Area()
        {
            return PartialView();
        }
        public ActionResult Drag()
        {
            GetSkills();
            return View();
        }
        public ActionResult Reading()
        {
            return View();
        }
        public ActionResult Listening()
        {
            return View();

        }
        public ActionResult HeatMaps()
        {
            return PartialView();

        }
        public ActionResult Speaking()
        {
            return View();
        }
        public ActionResult Toppers(string skills)
        {
            GetSkills();
            ViewBag.SkillType = skills;
            return View();
        }
        public ActionResult Dashboard()
        {
            GetSkills();
            IEnumerable<Count> count = null;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://172.24.133.45:2000/api/");
                var responseTask = client.GetAsync("Graphs/GetCount").Result;
                if (responseTask.IsSuccessStatusCode)
                {
                    var readTask = responseTask.Content.ReadAsAsync<IList<Count>>();
                    readTask.Wait();
                    count = readTask.Result;
                }
                else
                {
                    count = Enumerable.Empty<Count>();
                    ModelState.AddModelError(string.Empty, "Server error. Please contact administrator.");

                }
            }
            ViewBag.Message = count;
            return View();
        }
        public ActionResult GetSkills()

        {
            IEnumerable<string> skills = null;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://172.24.133.45:2000/api/");
                var responseTask = client.GetAsync("Graphs/GetSkillTypes").Result;
                if (responseTask.IsSuccessStatusCode)
                {
                    var readTask = responseTask.Content.ReadAsAsync<IList<string>>();
                    readTask.Wait();
                    skills = readTask.Result;
                }
                else
                {
                    skills = Enumerable.Empty<string>();
                    ModelState.AddModelError(string.Empty, "Server error. Please contact administrator.");

                }
            }
            ViewBag.skills = skills;
            return View();
        }
        public ActionResult PieWithBar()
        {
            return View();
        }
        public ActionResult Gauge()
        {
            return View();
        }
        public ActionResult Float()
        {
            return View();
        }
        public ActionResult MultiseriesLineChart()
        {
            return View();
        }
        public ActionResult Lollipop()
        {
            return View();
        }
        public ActionResult LineChart()
        {
            return View();
        }

        public PartialViewResult Test()
        {
            ViewBag.Temp = "TempValue";
            return PartialView();
        }

        [HttpGet]
        public PartialViewResult Display()
        {
            IEnumerable<Mark> marks = null;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://172.24.133.45:2000/api/");
                var responseTask = client.GetAsync("Graphs/GetOverAllAnalysis").Result;
                if (responseTask.IsSuccessStatusCode)
                {
                    var readTask = responseTask.Content.ReadAsAsync<IList<Mark>>();
                    readTask.Wait();
                    marks = readTask.Result;
                }
                else
                {
                    marks = Enumerable.Empty<Mark>();
                    ModelState.AddModelError(string.Empty, "Server error. Please contact administrator.");

                }
            }
            ViewBag.Message = marks;
            return PartialView();
        }
        [HttpGet]
        public PartialViewResult GetCount()
        {
            IEnumerable<Count> count = null;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://localhost:59348/api/");
                var responseTask = client.GetAsync("Graphs/GetCount").Result;
                if (responseTask.IsSuccessStatusCode)
                {
                    var readTask = responseTask.Content.ReadAsAsync<IList<Count>>();
                    readTask.Wait();
                    count = readTask.Result;
                }
                else
                {
                    count = Enumerable.Empty<Count>();
                    ModelState.AddModelError(string.Empty, "Server error. Please contact administrator.");

                }
            }
            ViewBag.Message = count;
            return PartialView();
        }
    }
}