class HomeController < ApplicationController
  skip_before_action :authenticate_tenant!, :only => [ :index ]

  def index
    if current_user
      if session[:tenant_id]
        Tenant.set_current_tenant session[:tenant_id]
      else
        Tenant.set_current_tenant current_user.tenants.first
      end
      
      @tenant = Tenant.current_tenant
      # (1 do this 1st) @projects = Project.by_plan_and_tenant(@tenant.id) #by_plan.. variable we declared in project.rb
      @projects = Project.by_user_plan_and_tenant(@tenant.id, current_user) # (2 after you make user_project)
      params[:tenant_id] = @tenant.id
    end
  end
  
end
