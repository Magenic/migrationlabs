using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace PicShare_GCPDemo.Models
{
    public class PicShareContext : DbContext
    {
        public PicShareContext (DbContextOptions<PicShareContext> options)
            : base(options)
        {
        }

        public DbSet<PicShare_GCPDemo.Models.Picture> Picture { get; set; }
    }
}
