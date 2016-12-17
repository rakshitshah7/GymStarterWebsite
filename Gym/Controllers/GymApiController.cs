using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using Gym.Models;

namespace Gym.Controllers
{
    public class GymApiController : ApiController
    {
        [Route("api/Gym/FetchMembershipData")]
        public List<string> FetchMembershipData()
        {
            string connetionString = ConfigurationManager.ConnectionStrings["applicationDB"].ConnectionString;
            SqlConnection cnn;
            DataTable dt = new DataTable();
            cnn = new SqlConnection(connetionString);
            List<string> stringArr = new List<string>();
            try
            {
                cnn.Open();
                string query = "SELECT Membership_Name FROM [dbo].[Membership]";
                SqlCommand cmd = new SqlCommand(query, cnn);

               
                dt.Load(cmd.ExecuteReader());
                foreach (DataRow r in dt.Rows)
                {
                    stringArr.Add(r[0].ToString());
                }
                // MessageBox.Show("Connection Open ! ");
                cnn.Close();
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Can not open connection ! ");
            }

            return stringArr;
        }

        [Route("api/Gym/RegisterMembershipData")]
        public int RegisterMembershipData(GymData inputarr)
        {
            string connetionString = ConfigurationManager.ConnectionStrings["applicationDB"].ConnectionString;
            SqlConnection cnn;
            DataTable dt = new DataTable();
            cnn = new SqlConnection(connetionString);
            int result = 1;
            try
            {
                cnn.Open();
                
                string query = String.Format("SELECT count(*) from Members M  where M.Member_Last_Name='{0}' AND M.Member_First_Name ='{1}' AND M.Member_Phone={2}",
                         inputarr.lastname, inputarr.firstname, inputarr.phonenumber);
                SqlCommand cmd = new SqlCommand(query, cnn);
                int count = Convert.ToInt32(cmd.ExecuteScalar());

                if (count > 0)
                    result = 101;
                else
                {
                    string query2 = String.Format("Exec dbo.sp_InsertMemberData '{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}',{7}", inputarr.lastname, inputarr.firstname, inputarr.address, inputarr.city,inputarr.state,inputarr.phonenumber,inputarr.starttime,inputarr.memberplanid);
                    SqlCommand cmd2 = new SqlCommand(query2, cnn);
                    result = Convert.ToInt32( cmd2.ExecuteScalar());
                }
                cnn.Close();
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Can not open connection ! ");
            }

            return result;
        }

        [Route("api/Gym/FetchMembersData")]
        public DataTable FetchMembersData() {

            string connetionString = ConfigurationManager.ConnectionStrings["applicationDB"].ConnectionString;
            SqlConnection cnn;
            DataTable dt = new DataTable();
            cnn = new SqlConnection(connetionString);
            List<string> stringArr = new List<string>();
            try
            {
                cnn.Open();
                string query = "Select * from Members M join Membership_Status MS on M.Membership_ID=MS.Membership_ID join Membership MP on MS.Membership_Type_ID=MP.Membership_Type_ID order by M.Membership_ID";
                SqlCommand cmd = new SqlCommand(query, cnn);


                dt.Load(cmd.ExecuteReader());
                
                // MessageBox.Show("Connection Open ! ");
                cnn.Close();
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Can not open connection ! ");
            }

            return dt;
        }

        [Route("api/Gym/UpdateMembersData")]
        public int UpdateMembersData(GymData inputarr)
        {
            int result = 1;
            string connetionString = ConfigurationManager.ConnectionStrings["applicationDB"].ConnectionString;
            SqlConnection cnn;
            DataTable dt = new DataTable();
            cnn = new SqlConnection(connetionString);
            List<string> stringArr = new List<string>();
            try
            {
                cnn.Open();
                string query = String.Format("Exec dbo.sp_UpdateMemberData {0}, '{1}', '{2}', '{3}', '{4}', '{5}', '{6}','{7}',{8}", inputarr.memberID,inputarr.lastname, inputarr.firstname, inputarr.address, inputarr.city, inputarr.state, inputarr.phonenumber, inputarr.starttime, inputarr.memberplanid);
                SqlCommand cmd = new SqlCommand(query, cnn);
                
                result = Convert.ToInt32(cmd.ExecuteScalar());

                
                // MessageBox.Show("Connection Open ! ");
                cnn.Close();
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Can not open connection ! ");
            }

            return result;
        }

        [HttpPost]
        [Route("api/Gym/DeleteMembersData")]
        public int DeleteMembersData(GymData inputarr)
        {
            int result = 1;
            string connetionString = ConfigurationManager.ConnectionStrings["applicationDB"].ConnectionString;
            SqlConnection cnn;
            DataTable dt = new DataTable();
            cnn = new SqlConnection(connetionString);
            List<string> stringArr = new List<string>();
            try
            {
                cnn.Open();
                
                string query1 = String.Format("EXEC dbo.sp_DeleteMemberData {0}", inputarr.memberID);
                SqlCommand cmd1 = new SqlCommand(query1, cnn);
                result = Convert.ToInt32(cmd1.ExecuteScalar());

                // MessageBox.Show("Connection Open ! ");
                cnn.Close();
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Can not open connection ! ");
            }

            return result;

        }

        [Route("api/Gym/FetchActivityData")]
        public DataTable FetchActivityData() {
            string connetionString = ConfigurationManager.ConnectionStrings["applicationDB"].ConnectionString;
            SqlConnection cnn;
            DataTable dt = new DataTable();
            cnn = new SqlConnection(connetionString);
            List<string> stringArr = new List<string>();
            try
            {
                cnn.Open();
                string query = "Select acs.Club_ID,CONCAT(c.Club_Name,' ',c.Club_City) as Club_Name,convert(date, acs.Schedule_Date) as Schedule_Date,A.Activity_Name,CONCAT(E.Employee_Last_Name,' ',E.Employee_First_Name) as Trainer_Name,convert(varchar, acs.Schedule_Start_Time, 8) as Start_Time,convert(varchar, acs.Schedule_End_Time, 8)as End_Time from Activity_Schedule acs join Activity A on acs.Activity_ID=A.Activity_ID join Clubs c on acs.Club_ID=c.Club_ID join Employees E on acs.Employee_ID=E.Employee_ID group by acs.Club_ID,acs.Schedule_Date,acs.Schedule_Start_Time,A.Activity_Name,acs.Schedule_End_Time,c.Club_Name,c.Club_City,E.Employee_First_Name,E.Employee_Last_Name";
                SqlCommand cmd = new SqlCommand(query, cnn);


                dt.Load(cmd.ExecuteReader());

                // MessageBox.Show("Connection Open ! ");
                cnn.Close();
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Can not open connection ! ");
            }

            return dt;
        }

        [Route("api/Gym/FetchEquipmentData")]
        public DataTable FetchEquipmentData()
        {
            string connetionString = ConfigurationManager.ConnectionStrings["applicationDB"].ConnectionString;
            SqlConnection cnn;
            DataTable dt = new DataTable();
            cnn = new SqlConnection(connetionString);
            List<string> stringArr = new List<string>();
            try
            {
                cnn.Open();
                string query = "SELECT Equipment_Name,Club_Name,Club_City,Count(CE.Equipment_Name)as Equipments   FROM Club_Equipment CE   Join Clubs C   on CE.Club_ID = C.Club_ID where C.Club_City = 'Boston'   group by Club_Name,Club_City,CE.Equipment_Name"; 
                SqlCommand cmd = new SqlCommand(query, cnn);


                dt.Load(cmd.ExecuteReader());

                // MessageBox.Show("Connection Open ! ");
                cnn.Close();
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Can not open connection ! ");
            }

            return dt;
        }

        [Route("api/Gym/RegisterPersonalTrainingData")]
        public int RegisterPersonalTrainingData(TrainerRegData inputarr)
        {
            string connetionString = ConfigurationManager.ConnectionStrings["applicationDB"].ConnectionString;
            SqlConnection cnn;
            DataTable dt = new DataTable();
            cnn = new SqlConnection(connetionString);
            int result = 1;
            try
            {
                cnn.Open();

                string query = String.Format("SELECT count(*) from Members M  where M.Membership_ID='{0}'",
                         inputarr.membershipID);
                SqlCommand cmd = new SqlCommand(query, cnn);
                int count = Convert.ToInt32(cmd.ExecuteScalar());

                string query3 = String.Format("Select count(*) from Personal_Training where Employee_ID={0} and '{1}' between Training_Start_Time and Dateadd(Minute,Training_Duration,Training_Start_Time)",
                         inputarr.empID,inputarr.starttime);
                SqlCommand cmd3 = new SqlCommand(query3, cnn);
                int count3 = Convert.ToInt32(cmd3.ExecuteScalar());

                if (count <= 0)
                    result = 101;
                else if (count3 > 0)
                { result = 102; }
                else
                {
                    string query2 = String.Format("Exec dbo.sp_RegisterPersonalMemberData '{0}', {1}, {2}, '{3}', {4}, '{5}'", inputarr.starttime, inputarr.membershipID, inputarr.empID, inputarr.ClubName, inputarr.Duration, inputarr.TrainingName);
                    SqlCommand cmd2 = new SqlCommand(query2, cnn);
                    result = Convert.ToInt32(cmd2.ExecuteScalar());
                }
                cnn.Close();
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Can not open connection ! ");
            }

            return result;
        }

        [Route("api/Gym/FetchClubData")]
        public List<string> FetchClubData()
        {
            string connetionString = ConfigurationManager.ConnectionStrings["applicationDB"].ConnectionString;
            SqlConnection cnn;
            DataTable dt = new DataTable();
            cnn = new SqlConnection(connetionString);
            List<string> stringArr = new List<string>();
            try
            {
                cnn.Open();
                string query = "SELECT Club_City FROM [dbo].[Clubs]";
                SqlCommand cmd = new SqlCommand(query, cnn);


                dt.Load(cmd.ExecuteReader());
                foreach (DataRow r in dt.Rows)
                {
                    stringArr.Add(r[0].ToString());
                }
                // MessageBox.Show("Connection Open ! ");
                cnn.Close();
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Can not open connection ! ");
            }

            return stringArr;
        }

        [Route("api/Gym/FetchTrainerData")]
        public DataTable FetchTrainerData()
        {
            string connetionString = ConfigurationManager.ConnectionStrings["applicationDB"].ConnectionString;
            SqlConnection cnn;
            DataTable dt = new DataTable();
            cnn = new SqlConnection(connetionString);
            List<string> stringArr = new List<string>();
            try
            {
                cnn.Open();
                string query = "SELECT CONCAT(E.Employee_Last_Name,' ',E.Employee_First_Name) as Trainer_Name,ET.Employee_Type,* FROM  Employees E join Employee_Type ET on E.Employee_Type_ID=ET.Employee_Type_ID where Et.Employee_Type like '%Trainer%'";
                SqlCommand cmd = new SqlCommand(query, cnn);


                dt.Load(cmd.ExecuteReader());

                // MessageBox.Show("Connection Open ! ");
                cnn.Close();
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Can not open connection ! ");
            }

            return dt;
        }
    }
}
