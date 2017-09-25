class Plan
# (PLANS) constant all capital
 PLANS = [:free, :premium]
 
 def self.options
   PLANS.map { |plan| [plan.capitalize, plan] }
 end
 #.map method used to modify all elements in an array that your passing to it
  
end
