using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PicShare_GCPDemo.Models;
using Microsoft.EntityFrameworkCore;

namespace PicShare_GCPDemo.Controllers
{
    public class HomeController : Controller
    {
        PicShareContext _context;

        public HomeController(PicShareContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult DbTest()
        {
            var model = _context.Picture.OrderBy(p => p.AddedDate).Take(5).ToList();
            return View(model);
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
