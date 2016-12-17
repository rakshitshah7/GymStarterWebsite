using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gym.Models
{
    public class GymData
    {
        public int memberID { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string phonenumber { get; set; }
        public int memberplanid { get; set; }
        public DateTime starttime { get; set; }
    }

    public class TrainerRegData
    {
        public int empID { get; set; }
        public int membershipID { get; set; }
        public string ClubName { get; set; }
        public string TrainingName { get; set; }
        public string Duration { get; set; }
        public DateTime starttime { get; set; }
    }
}