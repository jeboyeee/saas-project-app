class Project < ActiveRecord::Base
  belongs_to :tenant
  validates_uniqueness_of :title
  has_many :artifacts, dependent: :destroy
  validate :free_plan_can_only_have_one_project #custom validation
  
  def free_plan_can_only_have_one_project
   if self.new_record? && (tenant.projects.count > 0) && (tenant.plan == 'free')
      errors.add(:base, "Free plans cannot have more than one project")
   end
  end
  
  #Now we're going to have a placeholder method to this project.rb model file until we add the user projects relationship later on
  def self.by_plan_and_tenant(tenant_id)
     tenant = Tenant.find(tenant_id)
     if tenant.plan == 'premium' #if the plan is premium it will retrive all the prjects
       tenant.projects
     else #if not it retrieve only 1
       tenant.projects.order(:id).limit(1)
     end
  end 
  
end
