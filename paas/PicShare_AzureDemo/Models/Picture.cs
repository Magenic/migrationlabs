using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PicShare_GCPDemo.Models
{
    public class Picture
    {
        public int PictureId { get; set; }
        public string FilePath { get; set; }
        public string Caption { get; set; }
        public DateTimeOffset AddedDate { get; set; }
    }
}
