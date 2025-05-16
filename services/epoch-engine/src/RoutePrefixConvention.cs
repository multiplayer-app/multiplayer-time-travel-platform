using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

public class RoutePrefixConvention : IApplicationModelConvention
{
    private readonly AttributeRouteModel _prefix;

    public RoutePrefixConvention(string prefix)
    {
        // Ensure prefix starts with a slash
        if (!prefix.StartsWith("/")) prefix = "/" + prefix;

        _prefix = new AttributeRouteModel(new RouteAttribute(prefix));
    }

    public void Apply(ApplicationModel application)
    {
        foreach (var controller in application.Controllers)
        {
            foreach (var selector in controller.Selectors)
            {
                if (selector.AttributeRouteModel != null)
                {
                    selector.AttributeRouteModel = AttributeRouteModel.CombineAttributeRouteModel(
                        _prefix,
                        selector.AttributeRouteModel
                    );
                }
                else
                {
                    selector.AttributeRouteModel = _prefix;
                }
            }
        }
    }
}
